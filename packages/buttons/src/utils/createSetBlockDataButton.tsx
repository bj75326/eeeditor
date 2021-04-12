import React, { ReactNode, MouseEvent, useEffect } from 'react';
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
  blockMetaData: Record<string, string | boolean | number>;
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
  buttonKeyBindingFn,
  buttonKeyCommandHandler,
  buttonBeforeInputHandler,
}: CreateSetBlockDataButtonProps): EEEditorStyleButtonType {
  const SetBlockDataButton: EEEditorStyleButtonType = (props) => {
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
      syntax,
      getEditorState,
      setEditorState,
      getProps,
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
              Immutable.Map<string, string | boolean | number>(blockMetaData),
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

      // align buttons 会根据 Editor props textDirectionality 进行判断状态
      if (buttonType === 'align' && !metaData.get('align')) {
        if (
          (getProps().textDirectionality === 'LTR' &&
            blockMetaData.align === 'left') ||
          (getProps().textDirectionality === 'RTL' &&
            blockMetaData.align === 'right') ||
          (getProps().textDirectionality === 'NEUTRAL' &&
            blockMetaData.align === 'center')
        ) {
          return true;
        }
      }

      return !Object.keys(blockMetaData).some(
        // setBlockData 判断是否 active 时，只能比较直接量 etc. number | string | boolean
        (key) => metaData.get(key) !== blockMetaData[key],
      );
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
      [`${prefixCls}-btn-active`]: blockTypeIsActive(),
      [`${prefixCls}-btn-disabled`]: checkButtonShouldDisabled(),
    });

    const tipClassName = classNames(`${prefixCls}-tip`, {
      [`${prefixCls}-tip-reverse`]:
        tipReverse !== undefined
          ? tipReverse
          : tipProps.placement.startsWith('top'),
    });

    const tipTitle: ReactNode =
      title && title.name ? (
        <span className={tipClassName}>
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
