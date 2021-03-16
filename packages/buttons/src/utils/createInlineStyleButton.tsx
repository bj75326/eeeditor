import React, { ReactNode, MouseEvent, useEffect } from 'react';
import { RichUtils } from 'draft-js';
import { EditorPlugin } from '@eeeditor/editor';
import {
  EEEditorStyleButtonType,
  EEEditorStyleButtonProps,
  EEEditorButtonType,
} from '..';
import classNames from 'classnames';
import shouldButtonDisabled from './disableStrategy';
import { Tooltip } from 'antd';
import zhCN from '../locale/zh_CN';

interface CreateInlineStyleButtonProps {
  inlineStyle: string;
  buttonType: EEEditorButtonType;
  children: ReactNode;
  defaultTitle?: EEEditorStyleButtonProps['title'];
  buttonKeyBindingFn?: EditorPlugin['keyBindingFn'];
  buttonKeyCommandHandler?: EditorPlugin['handleKeyCommand'];
}

export default function CreateInlineStyleButton({
  inlineStyle,
  buttonType,
  children,
  defaultTitle,
  buttonKeyBindingFn,
  buttonKeyCommandHandler,
}: CreateInlineStyleButtonProps): EEEditorStyleButtonType {
  const InlineStyleButton: EEEditorStyleButtonType = (props) => {
    const {
      prefixCls = 'eee',
      className,
      style,
      locale = zhCN,
      title = defaultTitle,
      tipProps,
      icon,
      getEditorState,
      setEditorState,
      addKeyCommandHandler,
      removeKeyCommandHandler,
      addKeyBindingFn,
      removeKeyBindingFn,
      setSelectorBtnActive,
      setSelectorBtnDisabled,
      optionKey,
    } = props;

    const toggleStyle = (event: MouseEvent): void => {
      event.preventDefault();
      if (setEditorState) {
        setEditorState(
          RichUtils.toggleInlineStyle(getEditorState(), inlineStyle),
        );
      }
    };

    const preventBubblingUp = (event: MouseEvent): void => {
      event.preventDefault();
    };

    const inlineStyleIsActive = (): boolean => {
      if (!getEditorState) {
        return false;
      }
      const editorState = getEditorState();
      return editorState.getCurrentInlineStyle().has(inlineStyle);
    };

    useEffect(() => {
      if (buttonKeyBindingFn) {
        addKeyBindingFn(buttonKeyBindingFn);
      }
      if (buttonKeyCommandHandler) {
        addKeyCommandHandler(buttonKeyCommandHandler);
      }
      return () => {
        if (buttonKeyBindingFn) {
          removeKeyBindingFn(buttonKeyBindingFn);
        }
        if (buttonKeyCommandHandler) {
          removeKeyCommandHandler(buttonKeyCommandHandler);
        }
      };
    }, []);

    useEffect(() => {
      if (setSelectorBtnActive) {
        setSelectorBtnActive(inlineStyleIsActive(), optionKey);
      }
    }, [inlineStyleIsActive()]);

    const checkButtonShouldDisabled = (): boolean => {
      if (!getEditorState) {
        return true;
      }
      const editorState = getEditorState();
      const status = shouldButtonDisabled(editorState, buttonType);

      return status;
    };

    useEffect(() => {
      if (setSelectorBtnDisabled) {
        setSelectorBtnDisabled(checkButtonShouldDisabled(), optionKey);
      }
    }, [checkButtonShouldDisabled()]);

    const btnClassName = classNames(`${prefixCls}-btn`, className, {
      [`${prefixCls}-btn-active`]: inlineStyleIsActive(),
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
          <Tooltip
            title={tipTitle}
            overlayClassName={`${prefixCls}-tip-wrapper`}
            {...tipProps}
          >
            <div className={btnClassName} style={style} onClick={toggleStyle}>
              {icon || children}
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  return InlineStyleButton;
}
