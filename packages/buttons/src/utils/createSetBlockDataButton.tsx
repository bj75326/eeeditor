import React, { ReactNode, MouseEvent } from 'react';
import {
  EEEditorStyleButtonType,
  EEEditorButtonType,
  EEEditorStyleButtonProps,
} from '..';
import zhCN from '../locale/zh_CN';
import { EditorState, EditorPlugin, Modifier } from '@eeeditor/editor';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import shouldButtonDisabled from './disableStrategy';
import Immutable from 'immutable';

interface CreateSetBlockDataButtonProps {
  blockMetaData: Record<string, any>;
  buttonType: EEEditorButtonType;
  defaultChildren: ReactNode;
  defaultTitle?: EEEditorStyleButtonProps['title'];
  buttonKeyBindingFn?: EditorPlugin['keyBindingFn'];
  buttonKeyCommandHandler?: EditorPlugin['handleKeyCommand'];
  buttonBeforeInputHandler?: EditorPlugin['handleBeforeInput'];
}

export default function createSetBlockDataButton({
  blockMetaData,
  buttonType,
  defaultChildren,
  defaultTitle,
}: CreateSetBlockDataButtonProps): EEEditorStyleButtonType {
  const SetBlockDataButton: EEEditorStyleButtonType = (props) => {
    const {
      prefixCls = 'eee',
      className,
      style,
      locale = zhCN,
      title = defaultTitle,
      tipProps,
      children = defaultChildren,
      getEditorState,
      setEditorState,
      addKeyCommandHandler,
      removeKeyCommandHandler,
      addKeyBindingFn,
      removeKeyBindingFn,
      addBeforeInputHandler,
      removeBeforeInputHandler,
      setSelectorBtnActive,
      setSelectorBtnDisabled,
      optionKey,
    } = props;

    const mergeBlockData = (event: MouseEvent): void => {
      event.preventDefault();
      if (getEditorState && setEditorState) {
        const editorState = getEditorState();
        setEditorState(
          EditorState.push(
            editorState,
            Modifier.mergeBlockData(
              editorState.getCurrentContent(),
              editorState.getSelection(),
              Immutable.Map<string, any>(blockMetaData),
            ),
            'change-block-data',
          ),
        );
      }
    };

    const preventBubblingUp = (event: MouseEvent): void => {
      event.preventDefault();
    };

    const blockTypeIsActive = (): boolean => {
      if (!getEditorState) {
        return false;
      }
      const editorState = getEditorState();
      const metaData = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getData();

      return !Object.keys(blockMetaData).some(
        (key) => metaData.get(key) !== blockMetaData[key],
      );
    };

    const checkButtonShouldDisabled = (): boolean => {
      if (!getEditorState) {
        return true;
      }
      const editorState = getEditorState();
      const status = shouldButtonDisabled(editorState, buttonType);
      return status;
    };

    const btnClassName = classNames(`${prefixCls}-btn`, className, {
      [`${prefixCls}-btn-active`]: blockTypeIsActive(),
      [`${prefixCls}-btn-disabled`]: checkButtonShouldDisabled(),
    });

    const tipTitle: ReactNode =
      title && title.name ? (
        <span className={`${prefixCls}-tip`}>
          <span className={`${prefixCls}-tip-name`}>
            {locale[title.name] || title.name}
          </span>
          {title.shortcut && (
            <span className={`${prefixCls}-tip-shortcut`}>
              {locale[title.shortcut] || title.shortcut}
            </span>
          )}
        </span>
      ) : (
        ''
      );

    return (
      <div
        className={`${prefixCls}-btn-wrapper`}
        onMouseDown={preventBubblingUp}
      >
        {checkButtonShouldDisabled() ? (
          <div className={btnClassName} style={style}>
            {children}
          </div>
        ) : (
          <Tooltip
            title={tipTitle}
            overlayClassName={`${prefixCls}-tip-wrapper`}
            {...tipProps}
          >
            <div
              className={btnClassName}
              style={style}
              onClick={mergeBlockData}
            >
              {children}
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  return SetBlockDataButton;
}
