import React, { ReactNode, useState } from 'react';
import {
  EEEditorStyleButtonProps,
  EEEditorStyleButtonType,
  shouldButtonDisabled,
} from '@eeeditor/buttons';
import classNames from 'classnames';

export interface SelectorButtonProps
  extends Omit<
    EEEditorStyleButtonProps,
    'title' | 'locale' | 'icon' | 'align'
  > {
  icon: ReactNode;
  buttons: EEEditorStyleButtonType[];
}

export interface SelectorBtnOptionBtnProps extends EEEditorStyleButtonProps {
  onOption;
}

const SelectorButton: React.FC<SelectorButtonProps> = (props) => {
  const {
    prefixCls = 'eee',
    className,
    style,
    icon,
    buttons,
    getEditorState,
    setEditorState,
  } = props;

  const [visible, setVisible]: [boolean, any] = useState(false);
  const [btnActive, setBtnActive]: [boolean, any] = useState(false);
  const [btnDisabled, setBtnDisabled]: [boolean, any] = useState(true);

  const setSelectorBtnActive = (): void => {
    setBtnActive();
  };

  const btnClassName = classNames(`${prefixCls}-selector-btn`, className, {
    [`${prefixCls}-selector-btn-active`]: btnActive,
    [`${prefixCls}-selector-btn-disabled`]: btnDisabled,
  });

  return <div></div>;
};

export default SelectorButton;
