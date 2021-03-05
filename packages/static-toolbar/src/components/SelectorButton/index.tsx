import React, { ReactElement, ReactNode, useState } from 'react';
import { EEEditorStyleButtonProps } from '@eeeditor/buttons';
import classNames from 'classnames';
import { EditorState } from 'draft-js';

export interface SelectorBtnChildrenProps {
  setSelectorBtnActive: (active: boolean, optionKey: number) => void;
  setSelectorBtnDisabled: (disabled: boolean, optionKey: number) => void;
}

export interface SelectorButtonProps
  extends Omit<
    EEEditorStyleButtonProps,
    'title' | 'locale' | 'icon' | 'align'
  > {
  icon: ReactNode;
  children: ReactElement | ReactElement[];
}

const SelectorButton: React.FC<SelectorButtonProps> = (props) => {
  const { prefixCls = 'eee', className, style, icon, children } = props;

  const [visible, setVisible]: [boolean, any] = useState(false);
  const [btnActive, setBtnActive]: [boolean[], any] = useState([]);
  const [btnDisabled, setBtnDisabled]: [boolean[], any] = useState([]);

  const setSelectorBtnActive = (active: boolean, optionKey: number): void => {
    setBtnActive((btnActive: boolean[]) => {
      // todo 是否可以保留同一个数组对象引用
      btnActive[optionKey] = active;
      return btnActive;
    });
  };

  const setSelectorBtnDisabled = (
    disabled: boolean,
    optionKey: number,
  ): void => {
    setBtnDisabled((btnDisabled: boolean[]) => {
      // todo 是否可以保留同一个数组对象引用
      btnDisabled[optionKey] = disabled;
      return btnDisabled;
    });
  };

  const showOptions = (): void => {
    setVisible(true);
  };
  const hideOptions = (): void => {
    setVisible(false);
  };

  const childProps: SelectorBtnChildrenProps = {
    setSelectorBtnActive,
    setSelectorBtnDisabled,
  };

  const btnClassName = classNames(`${prefixCls}-selector-btn`, className, {
    [`${prefixCls}-selector-btn-active`]: btnActive.some(
      (status: boolean) => status,
    ),
    [`${prefixCls}-selector-btn-disabled`]: !btnDisabled.some(
      (status: boolean) => !status,
    ),
    [`${prefixCls}-selector-btn-show`]: visible,
  });

  const optionsClassName = classNames(`${prefixCls}-selector-btn-options`, {
    [`${prefixCls}-selector-btn-options-hidden`]:
      !visible || !btnDisabled.some((status: boolean) => !status),
  });

  return (
    <div
      className={`${prefixCls}-selector-btn-wrapper`}
      onMouseEnter={showOptions}
      onMouseLeave={hideOptions}
    >
      <div className={btnClassName} style={style}>
        {icon}
      </div>
      <div className={optionsClassName}>
        {React.Children.map<ReactElement, ReactElement>(
          children,
          (child, index) =>
            React.cloneElement(child, { ...childProps, optionKey: index }),
        )}
      </div>
    </div>
  );
};

export default SelectorButton;
