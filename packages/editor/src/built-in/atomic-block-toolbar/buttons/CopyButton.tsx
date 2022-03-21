import React, { CSSProperties, useContext, ReactNode, MouseEvent } from 'react';
import { PluginMethods, EEEditorContext } from '../../..';
import lang, { Languages, Locale, zhCN } from '../../../locale';
import { AtomicBlockProps } from '../';
import { Tooltip, message } from 'antd';
import { copyIcon } from '../../../assets/extraIcons';
import getFragmentFromSelection from 'draft-js/lib/getFragmentFromSelection';

export interface CopyButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  languages?: Languages;
}

export interface CopyButtonExtraProps extends Partial<PluginMethods> {
  placement?: 'top' | 'bottom';
  getBlockProps?: () => Partial<AtomicBlockProps>;
}

const CopyButtonComponent: React.FC<CopyButtonProps & CopyButtonExtraProps> = (
  props,
) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    languages = lang,
    placement,
    getBlockProps,
    getProps,
    getEditorRef,
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
    const editorState = getEditorState();
    const editorRef = getEditorRef();

    // if (editorState.getSelection().isCollapsed()) {
    //   return;
    // }
    try {
      editorRef.setClipboard(getFragmentFromSelection(editorState));
    } catch (err) {
      message.open({
        content:
          locale['eeeditor.block.toolbar.copy.error.msg'] ||
          'eeeditor.block.toolbar.copy.error.msg',
        type: 'error',
        duration: 3,
        className: `${prefixCls}-message`,
      });
    }

    message.open({
      content:
        locale['eeeditor.block.toolbar.copy.success.msg'] ||
        'eeeditor.block.toolbar.copy.success.msg',
      type: 'info',
      duration: 3,
      className: `${prefixCls}-message`,
    });
  };

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  return (
    <Tooltip
      title={getTipTitle('eeeditor.block.toolbar.copy.button.tip')}
      placement={placement}
      overlayClassName={`${prefixCls}-tip-wrapper`}
    >
      <span className={`${prefixCls}-popover-button`} onClick={handleBtnClick}>
        {copyIcon}
      </span>
    </Tooltip>
  );
};

export const CopyButton: React.FC<CopyButtonProps> = (props) => (
  <CopyButtonComponent {...props} />
);

export default CopyButton;
