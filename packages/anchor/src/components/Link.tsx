import React, { ReactNode, useState, MouseEvent } from 'react';
import { Popover, Tooltip } from 'antd';
import { getEditorRootDomNode } from '@eeeditor/editor';
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

  const [visible, setVisible]: [boolean, any] = useState(false);

  const onVisibleChange = (visible: boolean) => {
    setVisible(visible);
  };

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  const setSelectionAtLink = () => {
    // 使用原生 dom 提供的 selection 将当前 link leaf 设置为托蓝区
    const editorRoot = getEditorRootDomNode(getEditorRef());
    const ownerDocument = editorRoot.ownerDocument;

    if (!ownerDocument) return;

    const parentWindow = ownerDocument.defaultView;
    const linkNode = ownerDocument.querySelector(
      `a[data-offset-key="${offsetKey}"]`,
    );

    if (!linkNode) return;

    const textSpanNodes = linkNode.querySelectorAll('[data-text=true]');

    if (!textSpanNodes || textSpanNodes.length <= 0) return;

    const range = parentWindow.getSelection().getRangeAt(0);

    const firstTextLeafNode = textSpanNodes[0].firstChild;
    const lastTextLeafNode = textSpanNodes[textSpanNodes.length - 1].lastChild;

    if (!(firstTextLeafNode && lastTextLeafNode)) return;
    range.setStart(firstTextLeafNode, 0);
    range.setEnd(lastTextLeafNode, (lastTextLeafNode as Text).length);
  };

  const handleEdit = (event: MouseEvent): void => {
    event.preventDefault();
    setVisible(false);

    setSelectionAtLink();
    store.updateItem('initText', decoratedText);
    store.updateItem('initLink', href);
    store.updateItem('entityKey', entityKey);
    store.updateItem('offsetKey', offsetKey);
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
