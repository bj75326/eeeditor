import React, { ReactNode, MouseEvent } from 'react';
import { UndoRedoButtonProps, UndoPluginStore } from '../../';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import { EditorState } from '@eeeditor/editor';
import zhCN from '../../locale/zh_CN';

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

export interface UndoButtonProps extends UndoRedoButtonProps {
  store?: UndoPluginStore;
}

const UndoButton: React.FC<UndoButtonProps> = (props) => {
  const {
    prefixCls = 'eee',
    className,
    style,
    locale = zhCN,
    title = {
      name: 'eeeditor.undo.tip.name',
      shortcut: 'eeeditor.undo.tip.shortcut',
    },
    tipProps,
    children = defaultUndoIcon,
    store,
  } = props;

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

  const checkButtonShouldDisabled = (): boolean =>
    !store ||
    !store.getItem('getEditorState') ||
    store.getItem('getEditorState')().getUndoStack().isEmpty();

  const btnClassName = classNames(`${prefixCls}-btn`, className, {
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
