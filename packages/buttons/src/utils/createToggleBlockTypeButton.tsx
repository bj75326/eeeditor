import React, { ReactNode, MouseEvent, useEffect } from 'react';
import { RichUtils, DraftBlockType } from 'draft-js';
import { EditorPlugin } from '@eeeditor/editor';
import {
  EEEditorStyleButtonType,
  EEEditorButtonType,
  EEEditorStyleButtonProps,
} from '..';
import classNames from 'classnames';
import shouldButtonDisabled from './disableStrategy';
import { Tooltip } from 'antd';
import zhCN from '../locale/zh_CN';

interface CreateBlockStyleButtonProps {
  blockType: DraftBlockType;
  buttonType: EEEditorButtonType;
  defaultChildren: ReactNode;
  defaultTitle?: EEEditorStyleButtonProps['title'];
  buttonKeyBindingFn?: EditorPlugin['keyBindingFn'];
  buttonKeyCommandHandler?: EditorPlugin['handleKeyCommand'];
  buttonBeforeInputHandler?: EditorPlugin['handleBeforeInput'];
}

export default function createBlockStyleButton({
  blockType,
  buttonType,
  defaultChildren,
  defaultTitle,
  buttonKeyBindingFn,
  buttonKeyCommandHandler,
  buttonBeforeInputHandler,
}: CreateBlockStyleButtonProps): EEEditorStyleButtonType {
  const ToggleBlockTypeButton: EEEditorStyleButtonType = (props) => {
    const {
      prefixCls = 'eee',
      className,
      style,
      locale = zhCN,
      title = defaultTitle,
      tipProps,
      tipReverse,
      children = defaultChildren,
      keyCommand,
      grammar,
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
      setSelectorBtnIcon,
    } = props;

    const toggleStyle = (event: MouseEvent): void => {
      event.preventDefault();
      if (setEditorState) {
        setEditorState(RichUtils.toggleBlockType(getEditorState(), blockType));
      }
    };

    const preventBubblingUp = (event: MouseEvent): void => {
      event.preventDefault();
    };

    const blockTypeIsActive = (): boolean => {
      if (!getEditorState) {
        // if (setSelectorBtnActive) {
        //   setSelectorBtnActive(false, optionKey);
        // }
        return false;
      }
      const editorState = getEditorState();
      const type = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getType();

      // if (setSelectorBtnActive) {
      //   setSelectorBtnActive(type === blockType, optionKey);
      // }
      return type === blockType;
    };

    useEffect(() => {
      if (buttonKeyBindingFn) {
        addKeyBindingFn(buttonKeyBindingFn);
      }
      if (buttonKeyCommandHandler) {
        addKeyCommandHandler(buttonKeyCommandHandler);
      }
      if (buttonBeforeInputHandler) {
        addBeforeInputHandler(buttonBeforeInputHandler);
      }
      return () => {
        if (buttonKeyBindingFn) {
          removeKeyBindingFn(buttonKeyBindingFn);
        }
        if (buttonKeyCommandHandler) {
          removeKeyCommandHandler(buttonKeyCommandHandler);
        }
        if (buttonBeforeInputHandler) {
          removeBeforeInputHandler(buttonBeforeInputHandler);
        }
      };
    }, []);

    useEffect(() => {
      if (setSelectorBtnActive) {
        setSelectorBtnActive(blockTypeIsActive(), optionKey);
      }
      if (setSelectorBtnIcon && blockTypeIsActive()) {
        setSelectorBtnIcon(children);
      }
    }, [blockTypeIsActive()]);

    const checkButtonShouldDisabled = (): boolean => {
      if (!getEditorState) {
        // if (setSelectorBtnDisabled) {
        //   setSelectorBtnDisabled(true, optionKey);
        // }
        return true;
      }
      const editorState = getEditorState();
      const status = shouldButtonDisabled(editorState, buttonType);
      // if (setSelectorBtnDisabled) {
      //   setSelectorBtnDisabled(status, optionKey);
      // }
      return status;
    };

    useEffect(() => {
      if (setSelectorBtnDisabled) {
        setSelectorBtnDisabled(checkButtonShouldDisabled(), optionKey);
      }
    }, [checkButtonShouldDisabled()]);

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
            <div className={btnClassName} style={style} onClick={toggleStyle}>
              {children}
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  return ToggleBlockTypeButton;
}
