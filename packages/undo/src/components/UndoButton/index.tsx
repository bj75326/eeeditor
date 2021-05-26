import React, { ReactNode, MouseEvent, useEffect } from 'react';
import { UndoRedoButtonProps, Locale, zhCN } from '../..';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import { checkKeyCommand, EditorPlugin, EditorState } from '@eeeditor/editor';

const defaultUndoIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.9998 8L6 14L12.9998 21"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M6 14H28.9938C35.8768 14 41.7221 19.6204 41.9904 26.5C42.2739 33.7696 36.2671 40 28.9938 40H11.9984"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

const UndoButton: React.FC<UndoRedoButtonProps> = (props) => {
  const {
    prefixCls = 'eee',
    className,
    style,
    title = {
      name: 'eeeditor.undo.tip.name',
      shortcut: 'eeeditor.undo.tip.shortcut',
    },
    tipProps,
    tipReverse,
    children = defaultUndoIcon,
    keyCommand = {
      keyCode: 90,
      hasCommandModifier: true,
      isShiftKeyCommand: false,
    },
    store,
    languages,
  } = props;

  let locale: Locale = zhCN;
  if (store.getItem('getProps') && languages) {
    const { locale: currLocale } = store.getItem('getProps')();
    locale = languages[currLocale];
  }

  const preventBubblingUp = (event: MouseEvent): void => {
    event.preventDefault();
  };

  const undoStateChange = (event: MouseEvent): void => {
    event.preventDefault();
    const setEditorState = store.getItem('setEditorState');
    const getEditorState = store.getItem('getEditorState');

    if (setEditorState && getEditorState) {
      setEditorState(EditorState.undo(getEditorState()));
    }
  };

  useEffect(() => {
    store.updateItem(
      'undoButtonRendered',
      store.getItem('undoButtonRendered') + 1,
    );
    if (keyCommand) {
      const keyBindingFn: EditorPlugin['keyBindingFn'] = (event) => {
        if (checkKeyCommand(keyCommand, event)) {
          return 'undo';
        }
        return undefined;
      };

      const handleKeyCommand: EditorPlugin['handleKeyCommand'] = (
        command,
        editorState,
        { setEditorState },
      ) => {
        if (command === 'undo') {
          setEditorState(EditorState.undo(editorState));
          return 'handled';
        }
        return 'not-handled';
      };

      store.updateItem('undoButtonKeyBindingFn', keyBindingFn);
      store.updateItem('undoButtonKeyCommandHandler', handleKeyCommand);
      return () => {
        store.updateItem(
          'undoButtonRendered',
          store.getItem('undoButtonRendered') - 1,
        );
        store.updateItem('undoButtonKeyBindingFn', undefined);
        store.updateItem('undoButtonKeyCommandHandler', undefined);
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
    store.getItem('getEditorState')().getUndoStack().isEmpty();

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
          <div className={btnClassName} style={style} onClick={undoStateChange}>
            {children}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default UndoButton;
