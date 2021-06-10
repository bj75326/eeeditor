import React, {
  useState,
  useEffect,
  CSSProperties,
  useRef,
  useCallback,
} from 'react';
import { Form, Input } from 'antd';
import { AnchorPluginStore, Languages, Locale, zhCN } from '..';
import classNames from 'classnames';
import {
  getPopoverPosition,
  PopoverPosition,
  getEditorRootDomNode,
  getSelectedText,
} from '@eeeditor/editor';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import contains from 'rc-util/lib/Dom/contains';
import CSSMotion from 'rc-motion';

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
  const getEditorRef = store.getItem('getEditorRef');
  // stored link edit popover props
  // const visible = store.getItem('visible');

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale];
  }

  const [popoverVisible, setPopoverVisible]: [boolean, any] = useState(false);

  const popoverRef = useRef<HTMLDivElement>();

  const [form] = Form.useForm();

  const styleRef = useRef<CSSProperties>({ top: 0, left: 0 });
  // const initText = useRef<string>('');
  // const initLink = useRef<string>('');

  const onVisibleChange = (visible: boolean) => {
    if (visible) {
      form.setFieldsValue({ text: getSelectedText(getEditorState()) || '' });
    }
    // setPopoverVisible 触发重新渲染
    setPopoverVisible(visible);
  };

  useEffect(() => {
    store.subscribeToItem('visible', onVisibleChange);
    return () => {
      store.unsubscribeFromItem('visible', onVisibleChange);
    };
  }, []);

  const getPopoverDomNode = (): HTMLElement => {
    console.log('popoverRef.current', popoverRef.current);
    return popoverRef.current || null;
  };

  const onDocumentClick = useCallback(
    (event) => {
      if (popoverVisible) {
        const { target } = event;
        const popoverNode = getPopoverDomNode();
        if (!contains(popoverNode, target)) {
          setPopoverVisible(false);
        }
      }
    },
    [popoverVisible],
  );

  useEffect(() => {
    let currentDocument: HTMLDocument =
      getEditorRootDomNode(getEditorRef()).ownerDocument || window.document;
    const cleanOutsiderHandler = addEventListener(
      currentDocument,
      'mousedown',
      onDocumentClick,
    );
    return () => {
      cleanOutsiderHandler.remove();
    };
  }, [onDocumentClick]);

  const handlePopoverEnterPrepare = (popoverElement: HTMLElement): void => {
    const editorRoot: HTMLElement = getEditorRootDomNode(getEditorRef());
    const position = getPopoverPosition(editorRoot, popoverElement);
    styleRef.current = {
      top: `${position.top}px`,
      left: `${position.left}px`,
      transformOrigin: `50% ${
        popoverElement.getBoundingClientRect().height + 4
      }px`,
    };
  };

  const linkEditPopoverCls = classNames(
    `${prefixCls}-popover`,
    `${prefixCls}-link-edit-popover`,
    className,
  );

  return (
    <CSSMotion
      visible={popoverVisible}
      motionName={'ant-zoom-big'}
      motionDeadline={1000}
      leavedClassName={'ant-popover-hidden'}
      removeOnLeave={false}
      ref={popoverRef}
      onEnterPrepare={handlePopoverEnterPrepare}
    >
      {({ style, className }, motionRef) => {
        return (
          <div
            className={classNames(linkEditPopoverCls, className)}
            style={{
              ...style,
              ...styleRef.current,
            }}
            ref={motionRef}
          >
            <div className={`${prefixCls}-popover-content`}>
              <div
                className={`${prefixCls}-popover-arrow ${prefixCls}-popover-arrow-top`}
              >
                <span className={`${prefixCls}-popover-arrow-content`}></span>
              </div>
              <div className={`${prefixCls}-popover-inner`} role="tooltip">
                <Form form={form} autoComplete="off">
                  <Form.Item
                    name="text"
                    label={
                      locale['eeeditor.anchor.edit.text.label'] ||
                      'eeeditor.anchor.edit.text.label'
                    }
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="link"
                    label={
                      locale['eeeditor.anchor.edit.link.label'] ||
                      'eeeditor.anchor.edit.link.label'
                    }
                  >
                    <Input />
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        );
      }}
    </CSSMotion>
  );
};

export default LinkEditPopover;
