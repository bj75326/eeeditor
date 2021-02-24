import React, { ReactNode, useState } from 'react';
import {
  EEEditorStyleButtonProps,
  EEEditorStyleButtonType,
  shouldButtonDisabled,
} from '@eeeditor/buttons';
import classNames from 'classnames';
import { EditorState } from 'draft-js';

export interface SelectorBtnChildrenProps {
  getEditorState(): EditorState;
  setEditorState(editorState: EditorState): void;
  setSelectorBtnActive: () => void;
  setSelectorBtnDisabled: () => void;
  //optionKey: number;
}

export interface SelectorButtonProps
  extends Omit<
    EEEditorStyleButtonProps,
    'title' | 'locale' | 'icon' | 'align'
  > {
  icon: ReactNode;
  children: React.FC<EEEditor>;
}

const SelectorButton: React.FC<SelectorButtonProps> = (props) => {
  const {
    prefixCls = 'eee',
    className,
    style,
    icon,
    getEditorState,
    setEditorState,
  } = props;

  const [visible, setVisible]: [boolean, any] = useState(false);
  const [btnActive, setBtnActive]: [boolean[], any] = useState([]);
  const [btnDisabled, setBtnDisabled]: [boolean[], any] = useState([]);

  const setSelectorBtnActive = (): void => {};

  const setSelectorBtnDisabled = (): void => {};

  const showOptions = (): void => {
    setVisible(true);
  };
  const hideOptions = (): void => {
    setVisible(false);
  };

  const childrenProps: SelectorBtnChildrenProps = {
    getEditorState,
    setEditorState,
    setSelectorBtnActive,
    setSelectorBtnDisabled,
  };

  const btnClassName = classNames(`${prefixCls}-selector-btn`, className, {
    [`${prefixCls}-selector-btn-active`]: btnActive,
    [`${prefixCls}-selector-btn-disabled`]: btnDisabled,
  });

  return (
    <div
      className={btnClassName}
      style={style}
      onMouseEnter={showOptions}
      onMouseLeave={hideOptions}
    >
      <div>{icon}</div>
      <div className={`${prefixCls}-selector-btn-options`}></div>
    </div>
  );
};

export default SelectorButton;
