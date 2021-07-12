import React, {
  ReactNode,
  useState,
  MouseEvent,
  useContext,
  useRef,
} from 'react';
import { Popover, Tooltip, message } from 'antd';
import {
  getDecoratedLeavesOffset,
  DecoratedOffset,
  EEEditorContext,
  EditorState,
} from '@eeeditor/editor';
import { AnchorPluginStore, LinkEntityData, Languages, zhCN, Locale } from '..';
import classNames from 'classnames';
import extraIcons from '../assets/extraIcons';
import formatUrl from '../utils/formatUrl';
import removeLink from '../modifiers/removeLink';

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

  // antd 自带的 tooltip/popover trigger 功能不满足 eeeditor anchor 的要求
  // 比如在按下左键后鼠标移动到 link，onMouseEnter 事件不应该使 visible 为 true
  // 比如在 link 叶子节点上按下鼠标开始选择文本时，onMouseDown 事件应该使 visible 为 false
  // 所以在这里 eeeditor anchor 插件手动实现 trigger 的 event bind
  const delayTimer = useRef<number>();

  const delaySetVisible = (visible: boolean) => {
    const delay = 100; // 取 antd tooltip 组件 mouseEnterDelay & mouseLeaveDelay 默认值
    clearDelayTimer();
    delayTimer.current = window.setTimeout(() => {
      setVisible(visible);
      clearDelayTimer();
    }, delay);
  };

  const clearDelayTimer = () => {
    if (delayTimer.current) {
      clearTimeout(delayTimer.current);
      delayTimer.current = null;
    }
  };

  const handleMouseEnter = (event: MouseEvent): void => {
    if (event.buttons <= 0) {
      delaySetVisible(true);
    }
  };

  const handleMouseLeave = (event: MouseEvent): void => {
    delaySetVisible(false);
  };

  const handleMouseDown = (event: MouseEvent): void => {
    delaySetVisible(false);
  };

  const handlePopoverMouseEnter = (event: MouseEvent): void => {
    clearDelayTimer();
  };

  const handlePopoverMouseLeave = (event: MouseEvent): void => {
    delaySetVisible(false);
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
    store.updateItem('editPopoverVisible', true);
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
    setVisible(false);
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

  const content = (
    <div
      className={`${prefixCls}-link-popover`}
      onMouseEnter={handlePopoverMouseEnter}
      onMouseLeave={handlePopoverMouseLeave}
    >
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
      // onVisibleChange={onVisibleChange}
      trigger={[]}
    >
      <a
        className={linkClassName}
        rel="noopener noreferrer"
        href={formattedHref}
        target="_blank"
        data-offset-key={offsetKey}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
      >
        {children}
      </a>
    </Popover>
  );
};

export default Link;
