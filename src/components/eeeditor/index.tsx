import React, { useState } from 'react';
import Editor from '@draft-js-plugins/editor';
import { EditorState, convertToRaw } from 'draft-js';
import classNames from 'classnames';
import { EEEditorContext, DirectionType } from './context';
import enUS from './locale/en_US';
import zhCN from './locale/zh_CN';

export interface EEEditorProps {
  locale?: string;
  direction?: DirectionType;
}

const EEEditor: React.FC<EEEditorProps> = (props) => {
  const { locale, direction } = props;

  return (
    <EEEditorContext.Provider
      value={{
        locale,
      }}
    ></EEEditorContext.Provider>
  );
};

export default EEEditor;
