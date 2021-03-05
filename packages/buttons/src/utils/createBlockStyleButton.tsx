import React, { ReactNode, MouseEvent } from 'react';
import { RichUtils, DraftBlockType } from 'draft-js';
import { EEEditorStyleButtonType, EEEditorButtonType } from '..';
import classNames from 'classnames';
import shouldButtonDisabled from './disableStrategy';
import { Tooltip } from 'antd';
import zhCN from '../locale/zh_CN';

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
      locale = zhCN,
      title,
      align,
      icon,
      getEditorState,
      setEditorState,
      setSelectorBtnActive,
      setSelectorBtnDisabled,
      optionKey,
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
        if (setSelectorBtnActive) {
          setSelectorBtnActive(false, optionKey);
        }
        return false;
      }

      const editorState = getEditorState();
      const type = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getType();

      if (setSelectorBtnActive) {
        setSelectorBtnActive(type === blockType, optionKey);
      }
      return type === blockType;
    };

    const checkButtonShouldDisabled = (): boolean => {
      if (!getEditorState) {
        if (setSelectorBtnDisabled) {
          setSelectorBtnDisabled(true, optionKey);
        }
        return true;
      }
      const editorState = getEditorState();
      const status = shouldButtonDisabled(editorState, buttonType);
      if (setSelectorBtnDisabled) {
        setSelectorBtnDisabled(status, optionKey);
      }
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
            {icon || children}
          </div>
        ) : (
          <Tooltip title={tipTitle} align={align}>
            <div className={btnClassName} style={style} onClick={toggleStyle}>
              {icon || children}
            </div>
          </Tooltip>
        )}
      </div>
    );
  };
}
