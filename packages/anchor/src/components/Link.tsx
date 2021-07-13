import React, { ReactNode, MouseEvent, useContext, useRef } from 'react';
import {
  getDecoratedLeavesOffset,
  DecoratedOffset,
  EEEditorContext,
} from '@eeeditor/editor';
import { AnchorPluginStore, LinkEntityData, Languages, zhCN, Locale } from '..';
import classNames from 'classnames';
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

  // let linkOffset: DecoratedOffset;

  // if (children[0] && children[0].props.start >= 0) {
  //   linkOffset = getDecoratedLeavesOffset(
  //     getEditorState(),
  //     entityKey,
  //     offsetKey,
  //     children[0].props.start,
  //   );
  // }

  // if (!linkOffset) throw new Error('Link getDecoratedLeavesOffset error!');

  const linkPropsRef = useRef<LinkProps>({
    children,
    entityKey,
    decoratedText,
    offsetKey,
  });
  const getLinkProps = (): LinkProps => {
    return linkPropsRef.current || null;
  };

  // antd 自带的 tooltip/popover trigger 功能不满足 eeeditor anchor 的要求
  // 比如在按下左键后鼠标移动到 link，onMouseEnter 事件不应该使 visible 为 true
  // 比如在 link 叶子节点上按下鼠标开始选择文本时，onMouseDown 事件应该使 visible 为 false
  // 所以 eeeditor 使用了自定义的 linkPopover 组件

  const delayTimer = useRef<number>();

  const clearDelayTimer = () => {
    if (delayTimer.current) {
      clearTimeout(delayTimer.current);
      delayTimer.current = null;
    }
  };

  const showLinkPopover = () => {
    // store.updateItem('initText', decoratedText);
    // store.updateItem('initLink', href);
    // store.updateItem('entityKey', entityKey);
    // store.updateItem('offsetKey', offsetKey);
    // store.updateItem('linkOffset', linkOffset);

    store.updateItem('getLinkProps', getLinkProps);
    store.updateItem('onPopoverMouseEnter', handlePopoverMouseEnter);
    store.updateItem('onPopoverMouseLeave', handlePopoverMouseLeave);
    store.updateItem('linkPopoverVisible', true);
  };

  const hideLinkPopover = () => {
    store.updateItem('linkPopoverVisible', false);
  };

  const delaySetVisible = (visible: boolean) => {
    const delay = 100; // 取 antd tooltip 组件 mouseEnterDelay & mouseLeaveDelay 默认值
    clearDelayTimer();
    delayTimer.current = window.setTimeout(() => {
      if (visible) {
        showLinkPopover();
      } else {
        hideLinkPopover();
      }
      clearDelayTimer();
    }, delay);
  };

  const handleMouseEnter = (event: MouseEvent): void => {
    if (event.buttons <= 0) {
      delaySetVisible(true);
    }
  };

  const handleMouseLeave = (): void => {
    delaySetVisible(false);
  };

  const handleMouseDown = (): void => {
    delaySetVisible(false);
  };

  const handlePopoverMouseEnter = (): void => {
    clearDelayTimer();
  };

  const handlePopoverMouseLeave = (): void => {
    delaySetVisible(false);
  };

  const linkClassName = classNames(className, `${prefixCls}-link`);

  return (
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
  );
};

export default Link;
