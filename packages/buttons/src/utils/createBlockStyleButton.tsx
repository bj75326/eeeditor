import React, { ReactNode, MouseEvent } from 'react';
import { RichUtils, DraftBlockType } from 'draft-js';
import { EEEditorStyleButtonType, EEEditorButtonType } from '..';
import classNames from 'classnames';
import shouldButtonDisabled from './disableStrategy';
import { Tooltip } from 'antd';

interface CreateBlockStyleButtonProps {
  blockType: DraftBlockType;
  buttonType: EEEditorButtonType;
  children: ReactNode;
}

export default function createBlockStyleButton({
  blockType,
  buttonType,
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

    const getButtonStatus = (): boolean => {
      if (!getEditorState) {
        return true;
      }
      const editorState = getEditorState();
      return shouldButtonDisabled(editorState, buttonType);
    };

    const btnClassName = classNames(`${prefixCls}-btn`, className, {});

    return (
      <div className={btnClassName} style={style}>
        {getButtonStatus() ? (
          <div>{children}</div>
        ) : (
          <Tooltip title={title} align={}></Tooltip>
        )}
      </div>
    );
  };
}
