import React, {
  CSSProperties,
  ReactElement,
  useState,
  useEffect,
  useContext,
  useRef,
  MouseEvent,
} from 'react';
import {
  EditorState,
  SelectionState,
  EditorPlugin,
  EditorProps,
  EEEditorContextProps,
  PluginMethods,
  EEEditorContext,
  getEditorRootDomNode,
  setSelection,
} from '@eeeditor/editor';
import { createPortal } from 'react-dom';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import contains from 'rc-util/lib/Dom/contains';
import {
  BoldButton,
  ItalicButton,
  UnderlineButton,
  CodeButton,
} from '@eeeditor/buttons';
import { InlineToolbarPluginStore } from '..';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import {
  getInlineToolbarPosition,
  InlineToolbarPosition,
} from '../utils/getInlineToolbarPosition';
import { ConfigProvider } from 'antd';
import { DirectionType, ConfigContext } from 'antd/lib/config-provider';
import { Locale } from 'antd/lib/locale-provider';
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';

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
}

export interface ToolbarPubProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  childrenTipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  children?: ReactElement | ReactElement[];
}

interface ToolbarProps extends ToolbarPubProps {
  store: InlineToolbarPluginStore;
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const [visible, setVisible]: [boolean, any] = useState(true);

  const [overrideContent, setOverrideContent]: [
    ReactElement | ReactElement[],
    any,
  ] = useState(null);

  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    childrenTipProps = { placement: 'top' },
    children,
    store,
  } = props;

  const getProps = store.getItem('getProps');
  const getEditorRef = store.getItem('getEditorRef');

  const styleRef = useRef<CSSProperties>({ top: 0, left: 0, ...style });

  const toolbarRef = useRef<HTMLElement>(null);

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
    'inline-toolbar',
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

  const onSelectionChanged = () => {
    const selection = store.getItem('selection');
    if (selection && !selection.isCollapsed() && selection.getHasFocus()) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    store.subscribeToItem('selection', onSelectionChanged);
    return () => {
      store.unsubscribeFromItem('selection', onSelectionChanged);
    };
  }, []);

  const onDocumentClick = (event: MouseEvent) => {
    const { target } = event;
    const toolbarNode = toolbarRef.current || null;
    if (!contains(toolbarNode, target as Node)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    let currentDocument: HTMLDocument =
      getEditorRootDomNode(getEditorRef()).ownerDocument || window.document;
    const cleanOutsiderHandler = addEventListener(
      currentDocument,
      'mousedown',
      onDocumentClick,
    );
    return () => {
      cleanOutsiderHandler.remove();
    };
  }, []);

  const handleToolbarEnterPrepare = (toolbarElement: HTMLElement): void => {
    const editorRoot = getEditorRootDomNode(getEditorRef());

    let position: InlineToolbarPosition = getInlineToolbarPosition(
      editorRoot,
      toolbarElement,
    );

    styleRef.current = {
      ...styleRef.current,
      top: `${(position && position.top) || 0}px`,
      left: `${(position && position.left) || 0}px`,
      transformOrigin: `50% ${
        toolbarElement.getBoundingClientRect().height + 4
      }px`,
    };
  };

  const defaultButtons = [
    <BoldButton />,
    <ItalicButton />,
    <UnderlineButton />,
    <CodeButton />,
  ];

  const getContainer = () => {
    if (getEditorRef()) {
      return getEditorRootDomNode(getEditorRef()).ownerDocument.querySelector(
        '.inline-toolbar-plugin-suffix',
      );
    }
    return null;
  };
  useEffect(() => {
    console.log('check getContainer()   执行');
    setVisible(false);
  }, [getContainer()]);

  const { getPrefixCls: getAntdPrefixCls } = useContext(ConfigContext);

  const toolbarClassName = classNames(`${prefixCls}`, className);

  return getContainer()
    ? createPortal(
        <EEEditorContext.Provider value={eeeditorContextProps}>
          <ConfigProvider direction={antdDirection} locale={antdLocale}>
            <CSSMotion
              visible={visible}
              motionName={`${getAntdPrefixCls()}-zoom-big`}
              motionDeadline={1000}
              leavedClassName={`${getAntdPrefixCls('popover')}-hidden`}
              removeOnLeave={false}
              onEnterPrepare={handleToolbarEnterPrepare}
              ref={toolbarRef}
            >
              {({ style, className }, motionRef) => (
                <div
                  className={classNames(toolbarClassName, className)}
                  style={{
                    ...style,
                    ...styleRef.current,
                  }}
                  ref={motionRef}
                >
                  <div className={`${prefixCls}-content`}>
                    <div
                      className={`${prefixCls}-arrow ${prefixCls}-arrow-top`}
                    >
                      <span className={`${prefixCls}-arrow-content`}></span>
                    </div>
                    <div className={`${prefixCls}-inner`} role="tooltip">
                      {React.Children.map<ReactElement, ReactElement>(
                        children || defaultButtons,
                        (child) =>
                          React.cloneElement(child, {
                            ...childrenProps,
                            ...child.props,
                          }),
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CSSMotion>
          </ConfigProvider>
        </EEEditorContext.Provider>,
        document.querySelector('.inline-toolbar-plugin-suffix'),
      )
    : null;
};

export default Toolbar;
