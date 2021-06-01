import React from 'react';
import { Form, Input } from 'antd';
import { Locale, zhCN } from '..';

export interface LinkEditPopoverProps {
  prefixCls?: string;
  className?: string;
  locale?: Locale;
  initText?: string;
  initLink?: string;
  position: {
    top: number;
    left: number;
  };
}

const LinkEditPopover: React.FC<LinkEditPopoverProps> = (props) => {
  const {
    prefixCls = 'eee',
    className,
    locale = zhCN,
    initText,
    initLink,
    position,
  } = props;

  const [form] = Form.useForm();

  return (
    <div className={`${prefixCls}-link-popover`}>
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
