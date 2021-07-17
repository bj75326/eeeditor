import React, { ReactNode, MouseEvent, useEffect, useContext } from 'react';
import { RichUtils, DraftBlockType } from 'draft-js';
import { EditorPlugin, EEEditorContext } from '@eeeditor/editor';
import {
  EEEditorStyleButtonType,
  EEEditorExtraButtonProps,
  EEEditorButtonType,
  EEEditorButtonProps,
} from '..';
import classNames from 'classnames';
import shouldButtonDisabled, { StrategyType } from './disableStrategy';
import { Tooltip } from 'antd';
import lang, { Languages, zhCN, Locale } from '../locale';

interface CreateToggleBlockTypeButtonProps<K, S> {
  blockType: DraftBlockType;
  buttonType: EEEditorButtonType;
  defaultChildren: ReactNode;
  defaultTitle?: EEEditorButtonProps<K, S>['title'];
  defaultKeyCommand?: K;
  defaultSyntax?: S;
  getKeyBindingFn?: (keyCommand: K) => EditorPlugin['keyBindingFn'];
  buttonKeyCommandHandler?: EditorPlugin['handleKeyCommand'];
  getBeforeInputHandler?: (syntax: S) => EditorPlugin['handleBeforeInput'];
  languages?: Languages;
  disableStrategy?: Record<EEEditorButtonType, StrategyType>;
}

export default function createToggleBlockTypeButton<K, S>({
  blockType,
  buttonType,
  defaultChildren,
  defaultTitle,
  defaultKeyCommand,
  defaultSyntax,
  getKeyBindingFn,
  buttonKeyCommandHandler,
  getBeforeInputHandler,
  languages = lang,
  disableStrategy,
}: CreateToggleBlockTypeButtonProps<K, S>): EEEditorStyleButtonType<K, S> {
  const ToggleBlockTypeButton: React.FC<
    EEEditorButtonProps<K, S> & EEEditorExtraButtonProps
  > = (props) => {
    const {
      prefixCls: customizePrefixCls,
      className,
      style,
      title = defaultTitle,
      tipProps,
      tipReverse,
      children = defaultChildren,
      keyCommand = defaultKeyCommand,
      syntax = defaultSyntax,
      getEditorState,
      setEditorState,
      getProps,
      addKeyCommandHandler,
      removeKeyCommandHandler,
      addKeyBindingFn,
      removeKeyBindingFn,
      addBeforeInputHandler,
      removeBeforeInputHandler,
      setBtnActive,
      setBtnDisabled,
      optionKey,
      setBtnIcon,
    } = props;

    let locale: Locale = zhCN;
    if (getProps && languages) {
      const { locale: currLocale } = getProps();
      locale = languages[currLocale];
    }

    const { getPrefixCls } = useContext(EEEditorContext);
    const prefixCls = getPrefixCls(undefined, customizePrefixCls);

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
        // if (setBtnActive) {
        //   setBtnActive(false, optionKey);
        // }
        return false;
      }
      const editorState = getEditorState();
      const type = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getType();

      // if (setBtnActive) {
      //   setBtnActive(type === blockType, optionKey);
      // }
      return type === blockType;
    };

    let buttonKeyBindingFn = null;
    if (getKeyBindingFn && keyCommand) {
      buttonKeyBindingFn = getKeyBindingFn(keyCommand);
    }

    let buttonBeforeInputHandler = null;
    if (getBeforeInputHandler && syntax) {
      buttonBeforeInputHandler = getBeforeInputHandler(syntax);
    }

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
      if (setBtnActive) {
        setBtnActive(blockTypeIsActive(), optionKey);
      }
      if (setBtnIcon && blockTypeIsActive()) {
        setBtnIcon(children);
      }
    }, [blockTypeIsActive()]);

    const checkButtonShouldDisabled = (): boolean => {
      if (!getEditorState) {
        // if (setBtnDisabled) {
        //   setBtnDisabled(true, optionKey);
        // }
        return true;
      }
      const editorState = getEditorState();
      const status = shouldButtonDisabled(
        editorState,
        buttonType,
        disableStrategy,
      );
      // if (setBtnDisabled) {
      //   setBtnDisabled(status, optionKey);
      // }
      return status;
    };

    useEffect(() => {
      if (setBtnDisabled) {
        setBtnDisabled(checkButtonShouldDisabled(), optionKey);
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
          : tipProps && tipProps.placement.startsWith('top'),
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
            <div className={btnClassName} style={style} onClick={toggleStyle}>
              {children}
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  const DecoratedToggleBlockTypeButton: EEEditorStyleButtonType<K, S> = (
    props,
  ) => <ToggleBlockTypeButton {...props} />;

  return DecoratedToggleBlockTypeButton;
}
