import React, { ReactNode, MouseEvent, useState } from 'react';
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
  } = props;

  const getEditorState = store.getItem('getEditorState');
  const setEditorState = store.getItem('setEditorState');
  const getProps = store.getItem('getProps');

  const entity = getEditorState().getCurrentContent().getEntity(entityKey);

  const entityData: LinkEntityData = entity ? entity.getData() : undefined;
  const href = (entityData && entityData.url) || '';
  // const visible = (entityData && entityData.visible) || false;
  // const mode = (entityData && entityData.mode) || 'normal';
  // console.log('visible: ', visible);
  const formattedHref = formatUrl(href);

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale];
  }

  const [form] = Form.useForm();

  const [visible, setVisible]: [boolean, any] = useState(!!href ? false : true);
  const [mode, setMode]: ['edit' | 'normal', any] = useState(
    !!href ? 'normal' : 'edit',
  );

  const afterVisibleChange = (visible: boolean): void => {
    console.log('toggleVisible run!!!!!!!! ', visible);
    console.log(entityKey);

    setVisible(visible);
    // edit mode 下关闭 popover
    // if (mode === 'edit' && !visible) {

    //   console.log('form.getFieldValue("link"): ', form.getFieldValue('link'));
    //   // form link 为空值或者为无效值时，remove link entity
    //   if (!form.getFieldValue('link')) {

    //   }

    // }

    const editorState = getEditorState();

    editorState.getCurrentContent().mergeEntityData(entityKey, {
      visible,
    });
    console.log(
      'entity data: ',
      editorState.getCurrentContent().getEntity(entityKey).getData(),
    );
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
          key={type}
        >
          <span className={`${prefixCls}-link-popover-btn`}>
            {extraIcons[`${type}Icon`]}
          </span>
        </Tooltip>
      ))}
    </div>
  );

  const editModeContent = (
    <div className={`${prefixCls}-link-popover`}>
      <Form form={form}>
        <Form.Item
          name="text"
          label={
            locale['eeeditor.anchor.edit.text.label'] ||
            'eeeditor.anchor.edit.text.label'
          }
          initialValue={decoratedText}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="link"
          label={
            locale['eeeditor.anchor.edit.link.label'] ||
            'eeeditor.anchor.edit.link.label'
          }
          initialValue={href}
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );

  const linkClassName = classNames(className, `${prefixCls}-link`);

  return (
    <Popover
      content={mode === 'normal' ? normalModeContent : editModeContent}
      overlayClassName={`${prefixCls}-popover-wrapper`}
      trigger={mode === 'normal' ? 'hover' : 'click'}
      // trigger = "click"
      // visible={mode === 'normal' ? undefined : visible}
      visible={visible}
      onVisibleChange={afterVisibleChange}
    >
      <a
        className={linkClassName}
        rel="noopener noreferrer"
        href={formattedHref}
        target="_blank"
      >
        {children}
      </a>
    </Popover>
  );
};

export default Link;
