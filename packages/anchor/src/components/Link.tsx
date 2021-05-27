import React, { ReactNode, MouseEvent } from 'react';
import { Popover, Tooltip, Form, Input } from 'antd';
import { EditorState } from '@eeeditor/editor';
import { AnchorPluginStore, LinkEntityData, Languages, zhCN, Locale } from '..';
import classNames from 'classnames';
import extraIcons from '../assets/extraIcons';

const formatUrl = (href: string): string => {
  if (!/^((ht|f)tps?):\/\//.test(href)) {
    return `http://${href}`;
  }
  return href;
};

export interface LinkProps {
  children: ReactNode;
  entityKey: string;
  // getEditorState: () => EditorState;
  // setEditorState: (editorState: EditorState) => void;
}

export interface LinkExtraProps {
  prefixCls?: string;
  className?: string;
  languages?: Languages;
  store: AnchorPluginStore;
}

const Link: React.FC<LinkProps & LinkExtraProps> = (props) => {
  console.log('Link Props: ', props);
  const {
    prefixCls = 'eee',
    className,
    languages,
    store,
    children,
    entityKey,
  } = props;

  const getEditorState = store.getItem('getEditorState');
  const setEditorState = store.getItem('setEditorState');
  const getProps = store.getItem('getProps');

  const entity = getEditorState().getCurrentContent().getEntity(entityKey);

  const entityData: LinkEntityData = entity ? entity.getData() : undefined;
  const href = (entityData && entityData.url) || '';
  const visible = (entityData && entityData.visible) || false;
  const mode = (entityData && entityData.mode) || 'normal';

  const formattedHref = formatUrl(href);

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale];
  }

  const toggleVisible = (e: MouseEvent): void => {
    const editorState = getEditorState();

    editorState.getCurrentContent().mergeEntityData(entityKey, {
      visible: !visible,
    });
    // entity data 的改变并不会按照 immutable 规则
    // link popover visible 的改变不应该 push 到 undo/redo stack
    setEditorState(
      EditorState.forceSelection(editorState, editorState.getSelection()),
    );
  };

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  const normalModeContent = (
    <div className={`${prefixCls}-popover`}>
      <a
        className={`${prefixCls}-link-url`}
        title={formattedHref}
        href={formattedHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {formattedHref}
      </a>
      {[
        {
          type: 'edit',
        },
        {
          type: 'copy',
        },
        {
          type: 'delete',
        },
      ].map(({ type }) => (
        <Tooltip
          title={getTipTitle(`eeeditor.anchor.${type}.button.tip`)}
          overlayClassName={`${prefixCls}-tip-wrapper`}
          placement="top"
        >
          <span className={`${prefixCls}-popover-btn`}>
            {extraIcons[`${type}Icon`]}
          </span>
        </Tooltip>
      ))}
    </div>
  );

  const editModeContent = <div className={`${prefixCls}-popover`}></div>;

  const linkClassName = classNames(className, `${prefixCls}-link`);

  return (
    <Popover
      content={mode === 'normal' ? normalModeContent : editModeContent}
      visible={visible}
    >
      <a
        className={linkClassName}
        rel="noopener noreferrer"
        href={formattedHref}
        target="_blank"
        onClick={toggleVisible}
      >
        {children}
      </a>
    </Popover>
  );
};

export default Link;
