import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  CSSProperties,
  ReactNode,
  MouseEvent,
} from 'react';
import {
  EEEditorContext,
  EditorState,
  getEditorRootDomNode,
  getPopoverPosition,
  PopoverPosition,
} from '@eeeditor/editor';
import { AnchorPluginStore, Languages, Locale, zhCN } from '..';
import CSSMotion from 'rc-motion';
import { ConfigContext } from 'antd/lib/config-provider';
import classNames from 'classnames';
import { Tooltip, message } from 'antd';
import formatUrl from '../utils/formatUrl';
import removeLink from '../modifiers/removeLink';
import extraIcons from '../assets/extraIcons';

export interface LinkPopoverProps {
  prefixCls?: string;
  className?: string;
  store?: AnchorPluginStore;
  languages?: Languages;
}

const LinkPopover: React.FC<LinkPopoverProps> = (props) => {
  const { prefixCls: customizePrefixCls, className, store, languages } = props;

  const getEditorState = store.getItem('getEditorState');
  const setEditorState = store.getItem('setEditorState');
  const getProps = store.getItem('getProps');
  const getEditorRef = store.getItem('getEditorRef');

  const getLinkProps = store.getItem('getLinkProps');

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale];
  }

  const { getPrefixCls: getEEEPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getEEEPrefixCls(undefined, customizePrefixCls);

  const formattedHref = formatUrl(store.getItem('initLink'));
  const linkOffset = store.getItem('linkOffset');
  const handlePopoverMouseEnter = store.getItem('onPopoverMouseEnter');
  const handlePopoverMouseLeave = store.getItem('onPopoverMouseLeave');

  const [popoverVisible, setPopoverVisible]: [boolean, any] = useState(false);

  const popoverRef = useRef<HTMLDivElement>();

  const styleRef = useRef<CSSProperties>({});

  const onStoredVisibleChange = (visible: boolean) => {
    // setPopoverVisible 触发重新渲染
    setPopoverVisible(visible);
  };

  useEffect(() => {
    store.subscribeToItem('linkPopoverVisible', onStoredVisibleChange);
    return () => {
      store.unsubscribeFromItem('linkPopoverVisible', onStoredVisibleChange);
    };
  }, []);

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  const handleEdit = (event: MouseEvent): void => {
    event.preventDefault();
    setPopoverVisible(false);

    store.updateItem('mode', 'edit');
    store.updateItem('editPopoverVisible', true);
  };
  const handleCopy = (event: MouseEvent): void => {
    event.preventDefault();
    setPopoverVisible(false);

    navigator.clipboard.writeText(formattedHref).then(
      () => {
        message.open({
          content:
            locale['eeeditor.anchor.copy.success.msg'] ||
            'eeeditor.anchor.copy.success.msg',
          type: 'info',
          duration: 3,
          className: `${prefixCls}-message`,
        });
      },
      (error) => {
        throw new Error(error);
      },
    );
  };
  const handleDelete = (event: MouseEvent): void => {
    event.preventDefault();
    setPopoverVisible(false);
    const editorState = getEditorState();
    setEditorState(
      removeLink(
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
      ),
    );
  };

  const handlePopoverEnterPrepare = (popoverElement: HTMLElement): void => {
    const editorRoot: HTMLElement = getEditorRootDomNode(getEditorRef());
    const target: HTMLElement = editorRoot.ownerDocument.querySelector(
      `a[data-offset-key="${store.getItem('offsetKey')}"]`,
    );
    const position: PopoverPosition = getPopoverPosition(
      editorRoot,
      popoverElement,
      target,
    );
    styleRef.current = {
      top: `${(position && position.top) || 0}px`,
      left: `${(position && position.left) || 0}px`,
      transformOrigin: `50% ${
        popoverElement.getBoundingClientRect().height + 4
      }px`,
    };
  };

  const { getPrefixCls: getAntdPrefixCls } = useContext(ConfigContext);

  const linkPopoverCls = classNames(
    `${prefixCls}-popover`,
    `${prefixCls}-link-popover`,
    className,
  );

  return (
    <CSSMotion
      visible={popoverVisible}
      motionName={`${getAntdPrefixCls()}-zoom-big`}
      motionDeadline={1000}
      leavedClassName={`${getEEEPrefixCls()}-hidden`}
      removeOnLeave={false}
      ref={popoverRef}
      onEnterPrepare={handlePopoverEnterPrepare}
    >
      {({ style, className }, motionRef) => (
        <div
          className={classNames(linkPopoverCls, className)}
          style={{
            ...style,
            ...styleRef.current,
          }}
          ref={motionRef}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
        >
          <div className={`${prefixCls}-popover-content`}>
            <div
              className={`${prefixCls}-popover-arrow ${prefixCls}-popover-arrow-top`}
            >
              <span className={`${prefixCls}-popover-arrow-content`} />
            </div>
            <div className={`${prefixCls}-popover-inner`}>
              <div className={`${prefixCls}-link-popover-content`}>
                <a
                  className={`${prefixCls}-link-popover-url`}
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
                    <span
                      className={`${prefixCls}-link-popover-btn`}
                      onClick={onClick}
                    >
                      {extraIcons[`${type}Icon`]}
                    </span>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </CSSMotion>
  );
};

export default LinkPopover;
