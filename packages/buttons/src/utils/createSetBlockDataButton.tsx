import React, { ReactNode, MouseEvent, useEffect, useContext } from 'react';
import {
  EEEditorStyleButtonType,
  EEEditorExtraButtonProps,
  EEEditorButtonType,
  EEEditorButtonProps,
} from '..';
import {
  EditorState,
  EditorPlugin,
  Modifier,
  getSelectedBlocksMapKeys,
  EEEditorContext,
} from '@eeeditor/editor';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import shouldButtonDisabled, { StrategyType } from './disableStrategy';
import Immutable from 'immutable';
import lang, { Languages, zhCN, Locale } from '../locale';

interface CreateSetBlockDataButtonProps<K, S> {
  blockMetaData: Record<string, string | boolean | number>;
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

export default function createSetBlockDataButton<K, S>({
  blockMetaData,
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
}: CreateSetBlockDataButtonProps<K, S>): EEEditorStyleButtonType<K, S> {
  const SetBlockDataButton: React.FC<
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

    const mergeBlockData = (event: MouseEvent): void => {
      event.preventDefault();
      if (getEditorState && setEditorState) {
        const editorState = getEditorState();
        if (
          getSelectedBlocksMapKeys(editorState).some((value) => {
            const block = editorState.getCurrentContent().getBlockForKey(value);
            return Object.keys(blockMetaData).some(
              (key) => blockMetaData[key] !== block.getData().get(key),
            );
          })
        ) {
          // 1. selectionState 选中的所有 block 至少有一个没有设置对应的 metaData，则进行 merge metaData
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
        } else {
          // 2. selectionState 选中的所有 block 全都已经设置了对应的 metaData，则进行 toggle metaData
          const initMetaData = {};
          Object.keys(blockMetaData).forEach(
            (key) => (initMetaData[key] = undefined),
          );
          setEditorState(
            EditorState.push(
              editorState,
              Modifier.mergeBlockData(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                Immutable.Map<string, string | boolean | number>(initMetaData),
              ),
              'change-block-data',
            ),
          );
        }
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

      // 如果 block metaData 没有 align 值或者为假值时， align buttons 会根据 Editor props textDirectionality 进行判断状态
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
        // setBlockData 判断是否 active 时，只能比较直接量 number | string | boolean
        (key) => metaData.get(key) !== blockMetaData[key],
      );
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
      if (buttonKeyBindingFn && addKeyBindingFn) {
        addKeyBindingFn(buttonKeyBindingFn);
      }
      if (buttonKeyCommandHandler && addKeyCommandHandler) {
        addKeyCommandHandler(buttonKeyCommandHandler);
      }
      if (buttonBeforeInputHandler && addBeforeInputHandler) {
        addBeforeInputHandler(buttonBeforeInputHandler);
      }
      return () => {
        if (buttonKeyBindingFn && removeKeyBindingFn) {
          removeKeyBindingFn(buttonKeyBindingFn);
        }
        if (buttonKeyCommandHandler && removeKeyCommandHandler) {
          removeKeyCommandHandler(buttonKeyCommandHandler);
        }
        if (buttonBeforeInputHandler && removeBeforeInputHandler) {
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
        return true;
      }
      const editorState = getEditorState();
      const status = shouldButtonDisabled(
        editorState,
        buttonType,
        disableStrategy,
      );
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

  const DecoratedSetBlockDataButton: EEEditorStyleButtonType<K, S> = (
    props,
  ) => <SetBlockDataButton {...props} />;

  return DecoratedSetBlockDataButton;
}
