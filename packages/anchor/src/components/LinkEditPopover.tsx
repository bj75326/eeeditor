import React, { useState, useEffect, CSSProperties } from 'react';
import { Form, Input } from 'antd';
import { AnchorPluginStore, Languages, Locale, zhCN } from '..';
import classNames from 'classnames';

export interface LinkEditPopoverProps {
  prefixCls?: string;
  className?: string;
  store?: AnchorPluginStore;
  languages?: Languages;
}

const LinkEditPopover: React.FC<LinkEditPopoverProps> = (props) => {
  const { prefixCls = 'eee', className, store, languages } = props;

  const getEditorState = store.getItem('getEditorState');
  const setEditorState = store.getItem('setEditorState');
  const getProps = store.getItem('getProps');
  // stored link edit popover props
  const visible = store.getItem('visible');
  const initText = store.getItem('initText');
  const initLink = store.getItem('initLink');
  const entityKey = store.getItem('entityKey');
  const position = store.getItem('position');

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale];
  }

  const [popoverVisible, setPopoverVisible]: [boolean, any] = useState(false);
  const [popoverPosition, setPopoverPosition]: [
    { top: number; left: number },
    any,
  ] = useState(null);

  const [form] = Form.useForm();

  const onVisibleChange = (visible: boolean) => {
    setPopoverVisible(visible);
  };

  useEffect(() => {
    store.subscribeToItem('visible', onVisibleChange);
  }, []);

  const linkEditPopoverCls = classNames(
    `${prefixCls}-link-edit-popover`,
    className,
  );

  const getStyle = (): CSSProperties => {
    const style: CSSProperties = { ...position };
    if (!popoverVisible) {
      style.display = 'none';
    }
    return style;
  };

  return (
    <div className={linkEditPopoverCls} style={getStyle()}>
      <Form form={form}>
        <Form.Item
          name="text"
          label={
            locale['eeeditor.anchor.edit.text.label'] ||
            'eeeditor.anchor.edit.text.label'
          }
          initialValue={initText}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="link"
          label={
            locale['eeeditor.anchor.edit.link.label'] ||
            'eeeditor.anchor.edit.link.label'
          }
          initialValue={initLink}
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};

export default LinkEditPopover;
