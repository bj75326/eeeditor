import React, { ReactNode, MouseEvent } from 'react';
import { RichUtils } from 'draft-js';
import { EEEditorStyleButtonType } from '..';
import classNames from 'classnames';

interface CreateBlockStyleButtonProps {
  blockType: string;
  children: ReactNode;
}

export default function createBlockStyleButton({
  blockType,
  children,
}: CreateBlockStyleButtonProps): EEEditorStyleButtonType {
  return function BlockStyleButton(props) {
    const {
      prefixCls = 'eee',
      className,
      style,
      getEditorState,
      setEditorState,
    } = props;

    const toggleStyle = (event: MouseEvent): void => {
      event.preventDefault();
    };

    const btnClassName = classNames(`${prefixCls}-btn`, className);

    return <div className={btnClassName} style={style}></div>;
  };
}
