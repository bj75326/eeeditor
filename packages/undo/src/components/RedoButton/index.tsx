import React, { ReactNode, MouseEvent, useEffect } from 'react';
import { UndoRedoButtonProps } from '../..';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import {
  EditorState,
  EditorPlugin,
  bindCommandForKeyBindingFn,
} from '@eeeditor/editor';
import zhCN from '../../locale/zh_CN';

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
    prefixCls = 'eee',
    className,
    style,
    locale = zhCN,
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
    addKeyBindingFn,
    removeKeyBindingFn,
    addKeyCommandHandler,
    removeKeyCommandHandler,
  } = props;

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
    if (keyCommand) {
      const keyBindingFn: EditorPlugin['keyBindingFn'] = bindCommandForKeyBindingFn(
        'redo',
      )(keyCommand);

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

      addKeyBindingFn(keyBindingFn);
      addKeyCommandHandler(handleKeyCommand);
      return () => {
        removeKeyBindingFn(keyBindingFn);
        removeKeyCommandHandler(handleKeyCommand);
      };
    }
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
