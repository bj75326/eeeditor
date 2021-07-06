import React, { ReactNode, MouseEvent, useEffect, useContext } from 'react';
import { UndoRedoButtonProps, Locale, zhCN } from '../..';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import {
  EditorState,
  EditorPlugin,
  checkKeyCommand,
  EEEditorContext,
} from '@eeeditor/editor';

const defaultRedoIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M36 7L43 13.4615L36 21"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M40 14H17.0062C10.1232 14 4.27787 19.6204 4.00964 26.5C3.72612 33.7696 9.73291 40 17.0062 40H34.0016"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

const RedoButton: React.FC<UndoRedoButtonProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    title = {
      name: 'eeeditor.redo.tip.name',
      shortcut: 'eeeditor.redo.tip.shortcut',
    },
    tipProps,
    tipReverse,
    children = defaultRedoIcon,
    keyCommand = {
      keyCode: 90,
      hasCommandModifier: true,
      isShiftKeyCommand: true,
    },
    store,
    languages,
  } = props;

  let locale: Locale = zhCN;
  if (store.getItem('getProps') && languages) {
    const { locale: currLocale } = store.getItem('getProps')();
    locale = languages[currLocale];
  }

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  const preventBubblingUp = (event: MouseEvent): void => {
    event.preventDefault();
  };

  const redoStateChange = (event: MouseEvent): void => {
    event.preventDefault();
    const setEditorState = store.getItem('setEditorState');
    const getEditorState = store.getItem('getEditorState');

    if (setEditorState && getEditorState) {
      setEditorState(EditorState.redo(getEditorState()));
    }
  };

  useEffect(() => {
    store.updateItem(
      'redoButtonRendered',
      store.getItem('redoButtonRendered') + 1,
    );
    if (keyCommand) {
      const keyBindingFn: EditorPlugin['keyBindingFn'] = (event) => {
        if (checkKeyCommand(keyCommand, event)) {
          return 'redo';
        }
        return undefined;
      };

      const handleKeyCommand: EditorPlugin['handleKeyCommand'] = (
        command,
        editorState,
        { setEditorState },
      ) => {
        if (command === 'redo') {
          setEditorState(EditorState.redo(editorState));
          return 'handled';
        }
        return 'not-handled';
      };

      store.updateItem('redoButtonKeyBindingFn', keyBindingFn);
      store.updateItem('redoButtonKeyCommandHandler', handleKeyCommand);
      return () => {
        store.updateItem(
          'redoButtonRendered',
          store.getItem('redoButtonRendered') - 1,
        );
        store.updateItem('redoButtonKeyBindingFn', undefined);
        store.updateItem('redoButtonKeyCommandHandler', undefined);
      };
    }
    return () => {
      store.updateItem(
        'undoButtonRendered',
        store.getItem('undoButtonRendered') - 1,
      );
    };
  }, []);

  const checkButtonShouldDisabled = (): boolean =>
    !store ||
    !store.getItem('getEditorState') ||
    store.getItem('getEditorState')().getRedoStack().isEmpty();

  const btnClassName = classNames(`${prefixCls}-btn`, className, {
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
    <div className={`${prefixCls}-btn-wrapper`} onMouseDown={preventBubblingUp}>
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
          <div className={btnClassName} style={style} onClick={redoStateChange}>
            {children}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default RedoButton;
