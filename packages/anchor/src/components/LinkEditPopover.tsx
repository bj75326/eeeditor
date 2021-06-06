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
} from '@eeeditor/editor';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import contains from 'rc-util/lib/Dom/contains';

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

  const position = useRef<PopoverPosition>(null);
  const initText = useRef<string>('');
  const initLink = useRef<string>('');

  const onVisibleChange = (visible: boolean) => {
    // 通过 selectionState 获取当前选中 text
    const selectionState = getEditorState().getSelection();

    // 通过 editorRef 计算 popover position
    const editorRoot: HTMLElement = getEditorRootDomNode(getEditorRef());
    position.current = getPopoverPosition(editorRoot, popoverRef.current);

    setPopoverVisible(visible);
  };

  useEffect(() => {
    store.subscribeToItem('visible', onVisibleChange);
    return () => {
      store.unsubscribeFromItem('visible', onVisibleChange);
    };
  }, []);

  const getPopoverDomNode = (): HTMLElement => {
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

  const linkEditPopoverCls = classNames(
    `${prefixCls}-popover`,
    `${prefixCls}-link-edit-popover`,
    className,
  );

  const getStyle = (): CSSProperties => {
    const style: CSSProperties = { ...position.current };
    if (!popoverVisible) {
      style.visibility = 'hidden';
    }
    return style;
  };
  return (
    <div className={linkEditPopoverCls} style={getStyle()} ref={popoverRef}>
      <div className={`${prefixCls}-popover-arrow`}>
        <span className={`${prefixCls}-popover-arrow-content`}></span>
      </div>
      <div className={`${prefixCls}-popover-inner`} role="tooltip">
        <Form form={form}>
          <Form.Item
            name="text"
            label={
              locale['eeeditor.anchor.edit.text.label'] ||
              'eeeditor.anchor.edit.text.label'
            }
            initialValue={initText.current}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label={
              locale['eeeditor.anchor.edit.link.label'] ||
              'eeeditor.anchor.edit.link.label'
            }
            initialValue={initLink.current}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LinkEditPopover;
