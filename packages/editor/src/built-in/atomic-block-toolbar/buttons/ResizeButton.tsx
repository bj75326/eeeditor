import React, {
  CSSProperties,
  useState,
  ReactNode,
  useContext,
  MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  resizeIcon,
  PluginMethods,
  EEEditorContext,
  getEditorRootDomNode,
} from '../../..';
import lang, { zhCN, Locale, Languages } from '../../../locale';
import { AtomicBlockProps } from '..';
import { Tooltip } from 'antd';
import classNames from 'classnames';

export interface ResizeButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  languages?: Languages;
}

export interface ResizeButtonExtraProps {
  // RadioButton 提供
  btnKey?: string;
  activeBtn?: string;
  changeActiveBtn?: (activeBtn: string) => void;
  // ToolbarPopover 提供
  placement?: 'top' | 'bottom';
  pluginMethods?: PluginMethods;
  getBlockProps?: () => Partial<AtomicBlockProps>;
}

const ResizeButtonComponent: React.FC<
  ResizeButtonProps & ResizeButtonExtraProps
> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    languages = lang,
    btnKey,
    activeBtn,
    changeActiveBtn,
    placement,
    pluginMethods,
    getBlockProps,
  } = props;

  const { getProps, getEditorRef } = pluginMethods;

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  const [active, setActive] = useState<boolean>(false);

  const handleBtnClick = (e: MouseEvent): void => {
    console.log('test ', getEditorRef());

    if (btnKey) {
      const newActiveBtn = activeBtn === btnKey ? '' : btnKey;
      changeActiveBtn(newActiveBtn);
    } else {
      setActive(!active);
    }
  };

  const getContainer = () => {
    if (getEditorRef()) {
      return getEditorRootDomNode(getEditorRef()).ownerDocument.querySelector(
        `figure[data-offset-key="${getBlockProps().offsetKey}"]`,
      );
    }
    return null;
  };

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  const btnCls = classNames(`${prefixCls}-popover-button`, className, {
    [`${prefixCls}-popover-button-active`]: btnKey
      ? activeBtn === btnKey
      : active,
  });

  return (
    <>
      <Tooltip
        title={getTipTitle('eeeditor.component.resize.button.tip')}
        placement={placement}
        overlayClassName={`${prefixCls}-tip-wrapper`}
      >
        <span className={btnCls} style={style} onClick={handleBtnClick}>
          {resizeIcon}
        </span>
      </Tooltip>
      {(btnKey ? activeBtn === btnKey : active) &&
        getContainer() &&
        createPortal(
          <>
            <span
              className={`${prefixCls}-resize-handler ${prefixCls}-resizer-tl`}
            ></span>
            <span
              className={`${prefixCls}-resize-handler ${prefixCls}-resizer-tr`}
            ></span>
            <span
              className={`${prefixCls}-resize-handler ${prefixCls}-resizer-br`}
            ></span>
            <span
              className={`${prefixCls}-resize-handler ${prefixCls}-resizer-bl`}
            ></span>
          </>,
          getContainer(),
        )}
    </>
  );
};

export const ResizeButton: React.FC<ResizeButtonProps> = (props) => (
  <ResizeButtonComponent {...props} />
);

export default ResizeButton;
