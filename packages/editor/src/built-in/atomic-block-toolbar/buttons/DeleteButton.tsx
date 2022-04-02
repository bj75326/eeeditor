import React, { CSSProperties, useContext, ReactNode, MouseEvent } from 'react';
import { PluginMethods, EEEditorContext } from '../../..';
import lang, { Languages, Locale, zhCN } from '../../../locale';
import classNames from 'classnames';
import { AtomicBlockProps } from '..';
import { deleteIcon } from '../../../assets/extraIcons';
import { Tooltip } from 'antd';
import removeBlock from '../../../modifiers/removeBlock';

export interface DeleteButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  languages?: Languages;
}

export interface DeleteButtonExtraProps extends Partial<PluginMethods> {
  placement?: 'top' | 'bottom';
  getBlockProps?: () => Partial<AtomicBlockProps>;
}

const DeleteButtonComponent: React.FC<
  DeleteButtonProps & DeleteButtonExtraProps
> = (props) => {
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

    setEditorState(removeBlock(getEditorState(), block.getKey()));
  };

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  const btnCls = classNames(`${prefixCls}-popover-button`, className);

  return (
    <Tooltip
      title={getTipTitle('eeeditor.block.toolbar.delete.button.tip')}
      placement={placement}
      overlayClassName={`${prefixCls}-tip-wrapper`}
    >
      <span className={btnCls} style={style} onClick={handleBtnClick}>
        {deleteIcon}
      </span>
    </Tooltip>
  );
};

export const DeleteButton: React.FC<DeleteButtonProps> = (props) => (
  <DeleteButtonComponent {...props} />
);

export default DeleteButton;
