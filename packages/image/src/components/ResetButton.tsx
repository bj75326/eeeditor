import React, { CSSProperties, useContext, ReactNode, MouseEvent } from 'react';
import { PluginMethods, EEEditorContext } from '@eeeditor/editor';
import classNames from 'classnames';
import lang, { Languages, Locale, zhCN } from '../locale';
import { AtomicBlockProps } from '@eeeditor/editor/es/built-in/atomic-block-toolbar';
import { Tooltip } from 'antd';
import { resetIcon } from '../assets/extraIcons';
import resetCrop from '../modifiers/resetCrop';

export interface ResetButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  languages?: Languages;
}

export interface ResetButtonExtraProps extends Partial<PluginMethods> {
  placement?: 'top' | 'bottom';
  getBlockProps?: () => Partial<AtomicBlockProps>;
}

const ResetButtonComponent: React.FC<ResetButtonProps & ResetButtonExtraProps> =
  (props) => {
    const {
      prefixCls: customizePrefixCls,
      className,
      style,
      languages = lang,
      placement,
      getBlockProps,
      getProps,
      getEditorState,
      setEditorState,
    } = props;

    const { block } = getBlockProps();

    let locale: Locale = zhCN;
    if (getProps && languages) {
      const { locale: currLocale } = getProps();
      locale = languages[currLocale] || zhCN;
    }

    const { getPrefixCls } = useContext(EEEditorContext);
    const prefixCls = getPrefixCls(undefined, customizePrefixCls);

    const handleBtnClick = (e: MouseEvent) => {
      e.preventDefault();
      setEditorState(resetCrop());
    };

    const getTipTitle = (name: string): ReactNode => (
      <span className={`${prefixCls}-tip`}>
        <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
      </span>
    );

    const shouldBtnDisabled = (): boolean => {
      const blockData = block.getData();
      const cropBasedWidth = blockData.get('cropBasedWidth');

      if (typeof cropBasedWidth === 'number' && cropBasedWidth > 0) {
        return false;
      }

      return true;
    };

    const btnCls = classNames(`${prefixCls}-popover-button`, className, {
      [`${prefixCls}-popover-button-disabled`]: shouldBtnDisabled(),
    });

    return (
      <Tooltip
        title={getTipTitle('eeeditor.image.reset')}
        placement={placement}
        overlayClassName={`${prefixCls}-tip-wrapper`}
      >
        <span className={btnCls} style={style} onClick={handleBtnClick}>
          {resetIcon}
        </span>
      </Tooltip>
    );
  };

export const ResetButton: React.FC<ResetButtonProps> = (props) => (
  <ResetButtonComponent {...props} />
);

export default ResetButtonComponent;
