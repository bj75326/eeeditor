import React, {
  CSSProperties,
  ReactElement,
  useState,
  useEffect,
  MouseEvent,
  useContext,
} from 'react';
import {
  PluginMethods,
  EditorPlugin,
  EEEditorContextProps,
  getEditorRootDomNode,
  EEEditorContext,
} from '@eeeditor/editor';
import {} from '@eeeditor/buttons';
import { SideToolbarPluginStore } from '..';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import { ConfigProvider } from 'antd';
import { DirectionType, ConfigContext } from 'antd/lib/config-provider';
import { Locale } from 'antd/lib/locale-provider';
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { sideToolbarIcon } from '../assets/extraIcon';
import CSSMotion from 'rc-motion';

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
  style?: CSSProperties;
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
    style,
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

  const onSelectionChanged = () => {
    const selection = store.getItem('selection');
    if (selection) {
    }
  };

  useEffect(() => {
    store.subscribeToItem('selection', onSelectionChanged);
    return () => {
      store.unsubscribeFromItem('selection', onSelectionChanged);
    };
  }, []);

  const getContainer = () => {
    if (getEditorRef()) {
      return getEditorRootDomNode(getEditorRef()).ownerDocument.querySelector(
        'side-toolbar-plugin-suffix',
      );
    }
    return null;
  };
  useEffect(() => {
    setVisible(false);
  }, [getContainer()]);

  const toolbarWrapperCls = classNames(`${prefixCls}-wrapper`, className, {
    [`${prefixCls}-rtl`]: textDirectionality === 'RTL',
    [`${prefixCls}-hidden`]: !visible,
  });

  const toolbarIconCls = classNames(`${prefixCls}-icon`, {
    [`${prefixCls}-expanded`]: expanded,
  });

  const getMotionName = () => {
    const { getPrefixCls: getAntdPrefixCls } = useContext(ConfigContext);
    const antdPrefix = getAntdPrefixCls ? getAntdPrefixCls() : 'ant';
    const direction = textDirectionality === 'RTL' ? 'left' : 'right';
    return `${antdPrefix}-slide-${direction}`;
  };

  return getContainer()
    ? createPortal(
        <EEEditorContext.Provider value={eeeditorContextProps}>
          <ConfigProvider direction={antdDirection} locale={antdLocale}>
            <div className={toolbarWrapperCls} onMouseDown={preventBubblingUp}>
              <div className={toolbarIconCls}>{sideToolbarIcon}</div>
              <CSSMotion
                visible={visible}
                motionName={getMotionName()}
                motionDeadline={1000}
                // leavedClassName={ }
              ></CSSMotion>
            </div>
          </ConfigProvider>
        </EEEditorContext.Provider>,
        getContainer(),
      )
    : null;
};

export default Toolbar;
