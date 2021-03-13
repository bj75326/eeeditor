import React, { CSSProperties, ReactElement, useEffect } from 'react';
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
  getEditorState?: () => EditorState;
  setEditorState?: (editorState: EditorState) => void;
}

export interface ToolbarPubProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  locale?: Locale;
  children?: ReactElement | ReactElement[];
}

interface ToolbarProps extends ToolbarPubProps {
  store: StaticToolbarPluginStore;
}

export const HeaderButtonIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 8.00024V40.0002"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M24 8.00024V40.0002"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M7 24.0002H23"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M32 24V40"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M32 31.0237C32 28.4597 34 26.0002 37 26.0002C40 26.0002 42 28.3583 42 31.0237C42 32.8007 42 36.464 42 40.0136"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
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

  //useEffect(()=>{}, []);

  // const renderDefaultButtons = (
  //   externalProps: ToolbarChildrenProps,
  // ): ReactElement => (
  //   <>
  //     <SelectorButton {...externalProps} icon={HeaderButtonIcon}>
  //       <HeadlineOneButton {...externalProps} />
  //       <HeadlineTwoButton {...externalProps} />
  //       <HeadlineThreeButton {...externalProps} />
  //       <HeadlineFourButton {...externalProps} />
  //       <HeadlineFiveButton {...externalProps} />
  //       <HeadlineSixButton {...externalProps} />
  //     </SelectorButton>
  //   </>
  // );

  const defaultButtons = (
    <SelectorButton icon={HeaderButtonIcon}>
      <HeadlineOneButton />
      <HeadlineTwoButton />
      <HeadlineThreeButton />
      <HeadlineFourButton />
      <HeadlineFiveButton />
      <HeadlineSixButton />
    </SelectorButton>
  );

  const toolbarClassName = classNames(`${prefixCls}-static-toolbar`, className);

  return (
    <div className={toolbarClassName} style={style}>
      {React.Children.map<ReactElement, ReactElement>(
        children || defaultButtons,
        (child) => React.cloneElement(child, { ...childrenProps }),
      )}
    </div>
  );
};

export default Toolbar;
