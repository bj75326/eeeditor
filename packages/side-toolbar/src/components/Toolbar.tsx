import React, {
  ReactElement,
  useState,
  useEffect,
  MouseEvent,
  useRef,
  CSSProperties,
  useLayoutEffect,
} from 'react';
import {
  PluginMethods,
  EditorPlugin,
  EEEditorContextProps,
  getEditorRootDomNode,
  EEEditorContext,
  EditorState,
} from '@eeeditor/editor';
import { SideToolbarPluginStore } from '..';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import { ConfigProvider } from 'antd';
import { DirectionType } from 'antd/lib/config-provider';
import { Locale } from 'antd/lib/locale-provider';
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { sideToolbarIcon } from '../assets/extraIcon';
import getSideToolbarPosition, {
  SideToolbarPosition,
} from '../utils/getSideToolbarPosition';
import getReferenceEl from '../utils/getReferenceEl';
import shouldSideToolbarVisible from '../utils/shouldSideToolbarVisible';

export interface ToolbarChildrenProps extends Partial<PluginMethods> {
  // 提供方法给 buttons 动态增减 handleKeyCommand
  addKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  removeKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  // 提供方法给 buttons 动态增减 keyBindingFn
  addKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  removeKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  // 提供方法给 buttons 动态增减 handleBeforeInput
  addBeforeInputHandler?: (
    beforeInputHandler: EditorPlugin['handleBeforeInput'],
  ) => void;
  removeBeforeInputHandler?: (
    beforeInputHandler: EditorPlugin['handleBeforeInput'],
  ) => void;
  tipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  // 提供给 override buttons 的方法
  onOverride?: (overrideContent: ReactElement | ReactElement[]) => void;
}

export interface ToolbarPubProps {
  prefixCls?: string;
  className?: string;
  childrenTipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  children?: ReactElement | ReactElement[];
}

interface ToolbarProps extends ToolbarPubProps {
  store: SideToolbarPluginStore;
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    childrenTipProps = { placement: 'top' },
    children,
    store,
  } = props;

  const getProps = store.getItem('getProps');
  const getEditorState = store.getItem('getEditorState');
  const getEditorRef = store.getItem('getEditorRef');

  const {
    prefixCls: editorPrefixCls,
    locale: editorLocale,
    textDirectionality,
  } = getProps();

  const eeeditorContextProps: EEEditorContextProps = {
    getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
      if (customizePrefixCls) return customizePrefixCls;
      return suffixCls ? `${editorPrefixCls}-${suffixCls}` : editorPrefixCls;
    },
    textDirectionality: textDirectionality || 'LTR',
    locale: editorLocale,
  };

  const prefixCls = eeeditorContextProps.getPrefixCls(
    'side-toolbar',
    customizePrefixCls,
  );

  // antd 组件的 Context 设置
  let antdDirection: DirectionType;
  let antdLocale: Locale;

  if (textDirectionality === 'RTL') {
    antdDirection = 'rtl';
  } else {
    antdDirection = 'ltr';
  }

  switch (editorLocale) {
    case 'zh_CN':
      antdLocale = zhCN;
      break;
    case 'en_US':
      antdLocale = enUS;
      break;
    default:
      antdLocale = zhCN;
  }

  const [visible, setVisible] = useState<boolean>(true);

  const [expanded, setExpanded] = useState<boolean>(false);

  const [position, setPosition] = useState<SideToolbarPosition>({});

  const toolbarRef = useRef<HTMLDivElement>();

  const childrenProps: ToolbarChildrenProps = {
    getEditorState: store.getItem('getEditorState'),
    setEditorState: store.getItem('setEditorState'),
    getProps: store.getItem('getProps'),
    getEditorRef: store.getItem('getEditorRef'),
    // 提供方法给 buttons 动态增减 handleKeyCommand
    addKeyCommandHandler: (keyCommandHandler) => {
      const keyCommandHandlers = store.getItem('keyCommandHandlers');
      store.updateItem('keyCommandHandlers', [
        ...keyCommandHandlers.filter(
          (handler) => handler !== keyCommandHandler,
        ),
        keyCommandHandler,
      ]);
    },
    removeKeyCommandHandler: (keyCommandHandler) => {
      const keyCommandHandlers = store.getItem('keyCommandHandlers');
      store.updateItem(
        'keyCommandHandlers',
        keyCommandHandlers.filter((handler) => handler !== keyCommandHandler),
      );
    },
    // 提供方法给 buttons 动态增减 keyBindingFn
    addKeyBindingFn: (keyBindingFn) => {
      const keyBindingFns = store.getItem('keyBindingFns');
      store.updateItem('keyBindingFns', [
        ...keyBindingFns.filter((fn) => fn !== keyBindingFn),
        keyBindingFn,
      ]);
    },
    removeKeyBindingFn: (keyBindingFn) => {
      const keyBindingFns = store.getItem('keyBindingFns');
      store.updateItem(
        'keyBindingFns',
        keyBindingFns.filter((fn) => fn !== keyBindingFn),
      );
    },
    // 提供方法给 buttons 动态增减 handleBeforeInput
    addBeforeInputHandler: (beforeInputHandler) => {
      const beforeInputHandlers = store.getItem('beforeInputHandlers');
      store.updateItem('beforeInputHandlers', [
        ...beforeInputHandlers.filter(
          (handler) => handler !== beforeInputHandler,
        ),
        beforeInputHandler,
      ]);
    },
    removeBeforeInputHandler: (beforeInputHandler) => {
      const beforeInputHandlers = store.getItem('beforeInputHandlers');
      store.updateItem(
        'beforeInputHandlers',
        beforeInputHandlers.filter((handler) => handler !== beforeInputHandler),
      );
    },
    // inline toolbar 默认的 button tip props
    tipProps: childrenTipProps,
  };

  const preventBubblingUp = (event: MouseEvent): void => {
    event.preventDefault();
  };

  const onEditorStateChanged = (editorState: EditorState): void => {
    if (shouldSideToolbarVisible(editorState)) {
      // side toolbar 的显示隐藏没有动画，直接在 subscribe function 中加入计算位置的回调
      // onChange 内执行时获取的是最新的 editorState，还没有被渲染，所以使用 setTimeout 添加回调
      setTimeout(() => {
        const referenceEl = getReferenceEl(
          editorState,
          getEditorRootDomNode(getEditorRef()),
        );
        const position = getSideToolbarPosition(
          referenceEl,
          toolbarRef.current,
          // textDirectionality === 'RTL',
          getProps()['textDirectionality'] === 'RTL',
        );

        setPosition(position);
        setVisible(true);
        setExpanded(false);
      }, 0);
    } else {
      setTimeout(() => {
        setExpanded(false);
        setVisible(false);
      }, 0);
    }
  };

  useEffect(() => {
    store.subscribeToItem('editorState', onEditorStateChanged);
    return () => {
      store.unsubscribeFromItem('editorState', onEditorStateChanged);
    };
  }, []);

  // textDirectionality 变化需要重新计算 side toolbar 位置
  useEffect(() => {
    const referenceEl = getReferenceEl(
      getEditorState(),
      getEditorRootDomNode(getEditorRef()),
    );
    if (toolbarRef.current && referenceEl) {
      const position = getSideToolbarPosition(
        referenceEl,
        toolbarRef.current,
        textDirectionality === 'RTL',
      );
      setPosition(position);
    }
  }, [textDirectionality]);

  const toggleToolbarExpanded = (event: MouseEvent) => {
    event.preventDefault();
    setExpanded((expanded) => !expanded);
  };

  const getContainer = () => {
    if (getEditorRef()) {
      return getEditorRootDomNode(getEditorRef()).ownerDocument.querySelector(
        '.side-toolbar-plugin-suffix',
      );
    }
    return null;
  };
  useEffect(() => {
    // @eeeditor/editor suffix 渲染到真实 dom 之后
    setVisible(false);
  }, []);

  const toolbarWrapperCls = classNames(`${prefixCls}-wrapper`, className, {
    [`${prefixCls}-rtl`]: textDirectionality === 'RTL',
    [`${prefixCls}-hidden`]: !visible,
    [`${prefixCls}-expanded`]: expanded,
    [`${prefixCls}-unexpanded`]: !expanded,
  });

  const toolbarStyle: CSSProperties =
    textDirectionality === 'RTL'
      ? {
          top: `${position.top}px`,
          right: `${position.right}px`,
        }
      : {
          top: `${position.top}px`,
          left: `${position.left}px`,
        };

  // todo toolbarIconStyle 是使用 useRef 好，还是使用 useState 好？
  const toolbarIconStyle = useRef<CSSProperties>({
    marginLeft: 0,
    marginRight: 0,
  });
  useLayoutEffect(() => {
    const editorRoot = getEditorRootDomNode(getEditorRef());
    const rootElRect = editorRoot.getBoundingClientRect();
    const referenceElRect = getReferenceEl(
      getEditorState(),
      editorRoot,
    ).getBoundingClientRect();

    if (textDirectionality === 'RTL') {
      toolbarIconStyle.current = {
        marginLeft: `${rootElRect.right - referenceElRect.right}px`,
        marginRight: 0,
      };
    } else {
      toolbarIconStyle.current = {
        marginLeft: 0,
        marginRight: `${referenceElRect.left - rootElRect.left}px`,
      };
    }
  }, [textDirectionality]);

  return getContainer()
    ? createPortal(
        <EEEditorContext.Provider value={eeeditorContextProps}>
          <ConfigProvider direction={antdDirection} locale={antdLocale}>
            <div
              className={toolbarWrapperCls}
              style={toolbarStyle}
              onMouseDown={preventBubblingUp}
            >
              <div
                className={`${prefixCls}-icon`}
                style={toolbarIconStyle.current}
                onClick={toggleToolbarExpanded}
                ref={toolbarRef}
              >
                {sideToolbarIcon}
              </div>
              <div className={`${prefixCls}-btns`}>
                {React.Children.map<ReactElement, ReactElement>(
                  children,
                  (child) =>
                    React.cloneElement(child, {
                      ...childrenProps,
                      ...child.props,
                    }),
                )}
              </div>
            </div>
          </ConfigProvider>
        </EEEditorContext.Provider>,
        getContainer(),
      )
    : null;
};

export default Toolbar;
