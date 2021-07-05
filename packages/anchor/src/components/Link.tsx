import React, { ReactNode, useState, MouseEvent, useContext } from 'react';
import { Popover, Tooltip, message } from 'antd';
import {
  getDecoratedLeavesOffset,
  DecoratedOffset,
  EEEditorContext,
} from '@eeeditor/editor';
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
    prefixCls: customizePrefixCls,
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

  // 通过 getProps 获取 locale
  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale];
  }
  // 通过 context 获取 prefixCls
  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  let linkOffset: DecoratedOffset;

  if (children[0] && children[0].props.start >= 0) {
    linkOffset = getDecoratedLeavesOffset(
      getEditorState(),
      entityKey,
      offsetKey,
      children[0].props.start,
    );
  }

  if (!linkOffset) throw new Error('Link getDecoratedLeavesOffset error!');

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

    navigator.clipboard.writeText(formattedHref).then(
      () => {
        message.open({
          content:
            locale['eeeditor.anchor.copy.success.msg'] ||
            'eeeditor.anchor.copy.success.msg',
          type: 'info',
          duration: 30,
          className: `${prefixCls}-message`,
          icon: null,
        });
      },
      (error) => {
        throw new Error(error);
      },
    );
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
