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
  DecoratedOffset,
  getDecoratedLeavesOffset,
  editIcon,
  copyIcon,
  deleteIcon,
} from '@eeeditor/editor';
import { AnchorPluginStore, Languages, Locale, zhCN, LinkEntityData } from '..';
import CSSMotion from 'rc-motion';
import { ConfigContext } from 'antd/lib/config-provider';
import classNames from 'classnames';
import { Tooltip, message } from 'antd';
import formatUrl from '../utils/formatUrl';
import removeLink from '../modifiers/removeLink';

const extraIcons = { editIcon, copyIcon, deleteIcon };

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

  const getHref = (): string => {
    if (getLinkProps) {
      const entity = getEditorState()
        .getCurrentContent()
        .getEntity(getLinkProps()['entityKey']);
      const entityData: LinkEntityData = entity ? entity.getData() : undefined;
      return (entityData && entityData.url) || '';
    }

    return;
  };

  const formattedHref = formatUrl(getHref());

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const { getPrefixCls: getEEEPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getEEEPrefixCls(undefined, customizePrefixCls);

  const handlePopoverMouseEnter = store.getItem('onPopoverMouseEnter');
  const handlePopoverMouseLeave = store.getItem('onPopoverMouseLeave');

  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);

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

    try { 
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
        () => {
          message.open({
            content:
              locale['eeeditor.anchor.copy.error.msg'] ||
              'eeeditor.anchor.copy.error.msg',
            type: 'error',
            duration: 3,
            className: `${prefixCls}-message`,
          });  
        },
      );
    } catch (err) {
      message.open({
        content:
          locale['eeeditor.anchor.copy.error.msg'] ||
          'eeeditor.anchor.copy.error.msg',
        type: 'error',
        duration: 3,
        className: `${prefixCls}-message`,
      }); 
    }
  };
  const handleDelete = (event: MouseEvent): void => {
    event.preventDefault();
    setPopoverVisible(false);
    const editorState = getEditorState();

    const linkOffset: DecoratedOffset = getDecoratedLeavesOffset(
      getEditorState(),
      getLinkProps()['entityKey'],
      getLinkProps()['offsetKey'],
      getLinkProps()['children'][0].props.start,
    );

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
      `a[data-offset-key="${getLinkProps()['offsetKey']}"]`,
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
      motionName={`${getAntdPrefixCls ? getAntdPrefixCls() : 'ant'}-zoom-big`}
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
