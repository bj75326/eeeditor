import React, { CSSProperties, useState, ReactNode, useContext } from 'react';
import { resizeIcon, PluginMethods, EEEditorContext } from '../../..';
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
  placement: 'top' | 'bottom';
  pluginMethods: PluginMethods;
  getBlockProps: () => Partial<AtomicBlockProps>;
}

export const ResizeButton: React.FC<
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

  const { getProps } = pluginMethods;

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  // const [active, setActive] = useState<boolean>(false);

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  const btnCls = classNames(`${prefixCls}-popover-button`, className, {
    [`${prefixCls}-popover-button-active`]: activeBtn === btnKey,
  });

  return (
    <>
      <Tooltip
        title={getTipTitle}
        placement={placement}
        overlayClassName={`${prefixCls}-tip-wrapper`}
      >
        <span className={btnCls} style={style}>
          {resizeIcon}
        </span>
      </Tooltip>
    </>
  );
};

export default ResizeButton;
