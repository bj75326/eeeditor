import React, { CSSProperties, ReactElement } from 'react';
import { EditorState } from 'draft-js';
import { StaticToolbarPluginStore, Locale } from '../..';
import {
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  HeadlineFourButton,
  HeadlineFiveButton,
  HeadlineSixButton,
} from '@eeeditor/buttons';
import classNames from 'classnames';
import SelectorButton from '../SelectorButton';

export interface ToolbarChildrenProps {
  getEditorState: () => EditorState;
  setEditorState: (editorState: EditorState) => void;
}

export interface ToolbarPubProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  locale?: Locale;
  children?: React.FC<ToolbarChildrenProps>;
}

interface ToolbarProps extends ToolbarPubProps {
  store: StaticToolbarPluginStore;
}

export const HeaderButtonIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 8.00024V40.0002"
      stroke="#333"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="bevel"
    />
    <path
      d="M24 8.00024V40.0002"
      stroke="#333"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="bevel"
    />
    <path
      d="M7 24.0002H23"
      stroke="#333"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="bevel"
    />
    <path d="M32 24V40" stroke="#333" stroke-width="3" stroke-linecap="round" />
    <path
      d="M32 31.0237C32 28.4597 34 26.0002 37 26.0002C40 26.0002 42 28.3583 42 31.0237C42 32.8007 42 36.464 42 40.0136"
      stroke="#333"
      stroke-width="3"
      stroke-linecap="round"
    />
  </svg>
);

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const {
    prefixCls = 'eee',
    className,
    style,
    locale,
    children,
    store,
  } = props;

  const childrenProps: ToolbarChildrenProps = {
    getEditorState: store.getItem('getEditorState'),
    setEditorState: store.getItem('setEditorState'),
  };

  const renderDefaultButtons = (
    externalProps: ToolbarChildrenProps,
  ): ReactElement => (
    <div>
      <SelectorButton {...externalProps} icon={HeaderButtonIcon}>
        <HeadlineOneButton {...externalProps} />
        <HeadlineTwoButton {...externalProps} />
        <HeadlineThreeButton {...externalProps} />
        <HeadlineFourButton {...externalProps} />
        <HeadlineFiveButton {...externalProps} />
        <HeadlineSixButton {...externalProps} />
      </SelectorButton>
    </div>
  );

  const toolbarClassName = classNames(`${prefixCls}-static-toolbar`, className);

  return (
    <div className={toolbarClassName} style={style}>
      {(children || renderDefaultButtons)(childrenProps)}
    </div>
  );
};

export default Toolbar;
