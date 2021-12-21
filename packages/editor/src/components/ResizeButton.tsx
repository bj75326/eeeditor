import React, { CSSProperties, useState, ReactNode, useContext } from 'react';
import { resizeIcon, PluginMethods, EEEditorContext } from '..';
import lang, { zhCN, Locale, Languages } from '../locale';
import { AtomicBlockProps } from '../built-in/atomic-block-toolbar';
import { Tooltip } from 'antd';
import classNames from 'classnames';

export interface ResizeButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  languages?: Languages;
}

export interface ResizeButtonExtraProps {
  placement: 'top' | 'bottom';
  pluginMethods: PluginMethods;
  getBlockProps: () => Partial<AtomicBlockProps>;
}

const ResizeButton: React.FC<ResizeButtonProps & ResizeButtonExtraProps> = (
  props,
) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    languages = lang,
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

  const [active, setActive] = useState<boolean>(false);

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  const btnCls = classNames(`${prefixCls}-popover-button`, className, {});

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
