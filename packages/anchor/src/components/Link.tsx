import React, { ReactNode, useState, MouseEvent } from 'react';
import { Popover, Tooltip } from 'antd';
import { getDecoratedLeavesOffset, DecoratedOffset } from '@eeeditor/editor';
import { AnchorPluginStore, LinkEntityData, Languages, zhCN, Locale } from '..';
import classNames from 'classnames';
import extraIcons from '../assets/extraIcons';
import formatUrl from '../utils/formatUrl';

export interface LinkProps {
  children: ReactNode;
  entityKey: string;
  decoratedText: string;
  offsetKey: string;
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
  console.log('link props ----> ', props);
  const {
    prefixCls = 'eee',
    className,
    languages,
    store,
    children,
    entityKey,
    decoratedText,
    offsetKey,
  } = props;

  const getEditorState = store.getItem('getEditorState');
  const setEditorState = store.getItem('setEditorState');
  const getProps = store.getItem('getProps');
  const getEditorRef = store.getItem('getEditorRef');

  const entity = getEditorState().getCurrentContent().getEntity(entityKey);

  const entityData: LinkEntityData = entity ? entity.getData() : undefined;
  const href = (entityData && entityData.url) || '';

  const formattedHref = formatUrl(href);

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale];
  }

  let linkOffset: DecoratedOffset = null;

  if (children[0] && children[0].props.start >= 0) {
    linkOffset = getDecoratedLeavesOffset(
      getEditorState(),
      entityKey,
      offsetKey,
      children[0].props.start,
    );
  }

  const [visible, setVisible]: [boolean, any] = useState(false);

  const onVisibleChange = (visible: boolean) => {
    setVisible(visible);
  };

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  const handleEdit = (event: MouseEvent): void => {
    event.preventDefault();
    setVisible(false);

    store.updateItem('initText', decoratedText);
    store.updateItem('initLink', href);
    store.updateItem('entityKey', entityKey);
    store.updateItem('offsetKey', offsetKey);
    store.updateItem('linkOffset', linkOffset);
    store.updateItem('mode', 'edit');
    store.updateItem('visible', true);
  };
  const handleCopy = (event: MouseEvent): void => {
    event.preventDefault();
    setVisible(false);
  };
  const handleDelete = (event: MouseEvent): void => {
    event.preventDefault();
    setVisible(false);
  };

  const content = (
    <div className={`${prefixCls}-link-popover`}>
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
          onClick: handleEdit,
        },
        {
          type: 'copy',
          onClick: handleCopy,
        },
        {
          type: 'delete',
          onClick: handleDelete,
        },
      ].map(({ type, onClick }) => (
        <Tooltip
          title={getTipTitle(`eeeditor.anchor.${type}.button.tip`)}
          overlayClassName={`${prefixCls}-tip-wrapper`}
          placement="top"
          key={type}
        >
          <span className={`${prefixCls}-link-popover-btn`} onClick={onClick}>
            {extraIcons[`${type}Icon`]}
          </span>
        </Tooltip>
      ))}
    </div>
  );

  const linkClassName = classNames(className, `${prefixCls}-link`);

  return (
    <Popover
      content={content}
      overlayClassName={`${prefixCls}-popover-wrapper`}
      visible={visible}
      onVisibleChange={onVisibleChange}
    >
      <a
        className={linkClassName}
        rel="noopener noreferrer"
        href={formattedHref}
        target="_blank"
        data-offset-key={offsetKey}
      >
        {children}
      </a>
    </Popover>
  );
};

export default Link;
