import React, { ReactNode, MouseEvent } from 'react';
import { RichUtils } from 'draft-js';
import { EEEditorStyleButtonType } from '..';
import classNames from 'classnames';
import shouldButtonDisabled from './disableStrategy';
import {} from 'antd';

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
      setEditorState(RichUtils.toggleBlockType(getEditorState(), blockType));
    };

    const preventBubblingUp = (event: MouseEvent): void => {
      event.preventDefault();
    };

    const blockTypeIsActive = (): boolean => {
      if (!getEditorState) {
        return false;
      }

      const editorState = getEditorState();
      const type = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getType();
      return type === blockType;
    };

    const btnClassName = classNames(`${prefixCls}-btn`, className, {});

    return <div className={btnClassName} style={style}></div>;
  };
}
