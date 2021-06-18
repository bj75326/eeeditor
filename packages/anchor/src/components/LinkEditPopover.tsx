import React, {
  useState,
  useEffect,
  CSSProperties,
  useRef,
  useCallback,
  KeyboardEvent,
  CompositionEvent,
} from 'react';
import { Form, Input } from 'antd';
import { AnchorPluginStore, Languages, Locale, zhCN } from '..';
import classNames from 'classnames';
import {
  getPopoverPosition,
  PopoverPosition,
  getEditorRootDomNode,
  getSelectedText,
  EditorState,
} from '@eeeditor/editor';
import RichUtils from '@draft-js-plugins/utils';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import contains from 'rc-util/lib/Dom/contains';
import CSSMotion from 'rc-motion';
import validateUrl from '../utils/validateUrl';
import createLinkAtSelection from '../modifiers/createLinkAtSelection';

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

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale];
  }

  const [popoverVisible, setPopoverVisible]: [boolean, any] = useState(false);

  const popoverRef = useRef<HTMLDivElement>();

  const [form] = Form.useForm();

  const styleRef = useRef<CSSProperties>({ top: 0, left: 0 });

  const onStoredVisibleChange = (visible: boolean) => {
    const mode = store.getItem('mode');
    if (visible) {
      if (mode === 'new') {
        form.setFieldsValue({
          text: getSelectedText(getEditorState()) || '',
          link: '',
        });
      } else if (mode === 'edit') {
        form.setFieldsValue({
          text: store.getItem('initText') || '',
          link: store.getItem('initLink') || '',
        });
      }
    }
    // setPopoverVisible 触发重新渲染
    setPopoverVisible(visible);
  };

  useEffect(() => {
    store.subscribeToItem('visible', onStoredVisibleChange);
    return () => {
      store.unsubscribeFromItem('visible', onStoredVisibleChange);
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

  const handlePopoverEnterPrepare = (popoverElement: HTMLElement): void => {
    const editorRoot: HTMLElement = getEditorRootDomNode(getEditorRef());
    let position: PopoverPosition = null;
    if (store.getItem('mode') === 'new') {
      // position 由 selection 决定
      position = getPopoverPosition(editorRoot, popoverElement);
    } else {
      // position 由 decorated link <a> element 决定
      const target: HTMLElement = editorRoot.ownerDocument.querySelector(
        `a[data-offset-key="${store.getItem('offsetKey')}"]`,
      );
      if (target) {
        position = getPopoverPosition(editorRoot, popoverElement, target);
      }
    }

    styleRef.current = {
      top: `${position.top || 0}px`,
      left: `${position.left || 0}px`,
      transformOrigin: `50% ${
        popoverElement.getBoundingClientRect().height + 4
      }px`,
    };

    // focus link input
    const linkElement = popoverElement.querySelector('#link');

    if (linkElement) {
      (linkElement as HTMLInputElement).focus();
    }
  };

  const handlePopoverLeavePrepare = (): void => {
    getEditorRef().focus();
  };

  // 切换输入法模式下， enter keyup 不应该进行提交
  let compositionLock: boolean = false;
  const handleCompositionEnd = (event: CompositionEvent) => {
    compositionLock = true;
  };

  const handleInputKeyUp = (event: KeyboardEvent): void => {
    if (
      event.keyCode === 13 &&
      form.getFieldError(['link']).length <= 0 &&
      !compositionLock
    ) {
      const editorState = getEditorState();
      const mode = store.getItem('mode');
      const text = form.getFieldValue(['text']);
      const link = form.getFieldValue(['link']);

      // link 设置过程中导致的 editor 的失焦，会造成 undo 时，selectionBefore 的 bug，
      // 所以这里使用 forceSelection 修改当前 selection(newContent.selectionBefore) hasFocus 为 true
      // 或者也可以先使用 getEditorRef().focus(), 获取焦点之后 setTimeout 修改 editorState，但体验不好。

      if (mode === 'new') {
        if (link) {
          setEditorState(
            createLinkAtSelection(
              EditorState.forceSelection(
                editorState,
                editorState.getSelection().merge({
                  hasFocus: true,
                }),
              ),
              { url: link },
              text || link, // text 为空，则使用 link 值作为 text
            ),
          );
        }
        setPopoverVisible(false);
      }

      if (mode === 'edit') {
        if (link) {
          if (link !== store.getItem('initLink')) {
            const linkOffset = store.getItem('linkOffset');
            setEditorState(
              createLinkAtSelection(
                EditorState.forceSelection(
                  editorState,
                  editorState.getSelection().merge({
                    anchorKey: linkOffset.startKey,
                    anchorOffset: linkOffset.startOffset,
                    focusKey: linkOffset.endKey,
                    focusOffset: linkOffset.endOffset,
                    hasFocus: true,
                    isBackward: false,
                  }),
                ),
                { url: link },
                text || link, // text 为空，则使用 link 值作为 text
              ),
            );
          }
          setPopoverVisible(false);
        }
      }
    }

    // 重置 compositionLock
    compositionLock = false;
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
      onLeavePrepare={handlePopoverLeavePrepare}
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
                    <Input
                      placeholder={
                        locale['eeeditor.anchor.edit.text.placeholder'] ||
                        'eeeditor.anchor.edit.text.placeholder'
                      }
                      onCompositionEnd={handleCompositionEnd}
                      onKeyUp={handleInputKeyUp}
                    />
                  </Form.Item>
                  <Form.Item
                    name="link"
                    label={
                      locale['eeeditor.anchor.edit.link.label'] ||
                      'eeeditor.anchor.edit.link.label'
                    }
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value && !validateUrl(value)) {
                            return Promise.reject();
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      placeholder={
                        locale['eeeditor.anchor.edit.link.placeholder'] ||
                        'eeeditor.anchor.edit.link.placeholder'
                      }
                      onCompositionEnd={handleCompositionEnd}
                      onKeyUp={handleInputKeyUp}
                    />
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
