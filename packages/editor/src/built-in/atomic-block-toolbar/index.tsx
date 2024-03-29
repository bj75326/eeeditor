import React, { ComponentType, useEffect, useRef } from 'react';
import { Store } from '@draft-js-plugins/utils';
import {
  ContentBlock,
  SelectionState,
  ContentState,
  EditorPlugin,
  insertAtomicBlockWithoutSplit,
} from '../..';

export * from './components/RadioGroup';

export * from './components/ToolbarPopover';

export * from './components/Separator';

export * from './components/SelectorGroup';

export * from './buttons/CopyButton';

export * from './buttons/DeleteButton';

export interface AtomicBlockProps {
  block: ContentBlock;
  blockProps: {
    isFocused?: boolean;
    focusable?: boolean;
    setFocusToBlock?: () => void;
  };
  customStyleMap: unknown;
  customStyleFn: unknown;
  decorator: unknown;
  direction: unknown;
  forceSelection: unknown;
  offsetKey: string;
  selection: SelectionState;
  tree: unknown;
  contentState: ContentState;
  blockStyleFn: unknown;
  preventScroll: unknown;
}

export interface AtomicBlockToolbarDecoratorProps extends AtomicBlockProps {
  store: Store<{
    getBlockProps?: () => Partial<AtomicBlockProps>;
    toolbarPopoverOffsetKey?: string;
  }>;
}

type WrappedComponentType = ComponentType<AtomicBlockToolbarDecoratorProps> & {
  WrappedComponent?: ComponentType<AtomicBlockToolbarDecoratorProps>;
};

const getDisplayName = (WrappedComponent: WrappedComponentType): string => {
  const component = WrappedComponent.WrappedComponent || WrappedComponent;
  return component.displayName || component.name || 'Component';
};

export const blockToolbarDecorator = (
  WrappedComponent: WrappedComponentType,
): ComponentType<AtomicBlockToolbarDecoratorProps> => {
  const AtomicBlockToolbarDecorator = (
    props: AtomicBlockToolbarDecoratorProps,
  ) => {
    const {
      block,
      blockProps,
      customStyleMap,
      customStyleFn,
      decorator,
      direction,
      forceSelection,
      offsetKey,
      selection,
      tree,
      contentState,
      blockStyleFn,
      preventScroll,
      store, // extra props
    } = props;
    const { isFocused } = blockProps;

    // 将当前 block props 存放在 ref，使 toolbar popover 和其 children 可以获取 block props
    const blockPropsRef = useRef<Partial<AtomicBlockToolbarDecoratorProps>>();
    blockPropsRef.current = {
      block,
      blockProps,
      customStyleMap,
      customStyleFn,
      decorator,
      direction,
      forceSelection,
      offsetKey,
      selection,
      tree,
      contentState,
      blockStyleFn,
      preventScroll,
    };
    const getBlockProps = () => blockPropsRef.current;

    // isFocused 的变化改变 image toolbar popover 的显隐状态
    useEffect(() => {
      if (isFocused) {
        store.updateItem('getBlockProps', getBlockProps);
        store.updateItem('toolbarPopoverOffsetKey', offsetKey);
      } else {
        if (store.getItem('toolbarPopoverOffsetKey') === offsetKey) {
          store.updateItem('getBlockProps', null);
          store.updateItem('toolbarPopoverOffsetKey', '');
        }
      }
      // return () => {
      //   console.log('return function 内 isFocused 这个时候将 toolbarPopoverOffsetKey 设置为 ', isFocused);
      //   console.log('store 内的 toolbarPopoverOffsetKey ', store.getItem('toolbarPopoverOffsetKey'));
      // };
    }, [isFocused]);

    // todo: 是否需要加上 unmount hook
    useEffect(() => {
      return () => {
        // 使用了 atomic block toolbar 的 block 在 unmount 时，store 内将 toolbarPopoverOffsetKey 设置为 ''
        store.updateItem('toolbarPopoverOffsetKey', '');
      };
    }, []);

    return <WrappedComponent {...props} />;
  };

  AtomicBlockToolbarDecorator.displayName = `AtomicBlockToolbar(${getDisplayName(
    WrappedComponent,
  )})`;

  (AtomicBlockToolbarDecorator as any).WrappedComponent =
    WrappedComponent.WrappedComponent || WrappedComponent;

  return AtomicBlockToolbarDecorator;
};

export default (): EditorPlugin => ({
  handlePastedText(text, _, editorState, { getEditorRef, setEditorState }) {
    if (text === 'eeeditor.atomic-block.paste') {
      // 单独的 atomic block paste
      const internalClipboard = getEditorRef().getClipboard();
      if (internalClipboard && internalClipboard.size === 1) {
        const block = internalClipboard.first();
        // 复制 block
        console.log('handlePastedText test ----> ', block.getEntityAt(0));
        const entityKey = block.getEntityAt(0);
        const character = block.getText();
        const data = block.getData();

        setEditorState(
          insertAtomicBlockWithoutSplit(editorState, entityKey, ' ', data),
        );

        return 'handled';
      }
    }

    return 'not-handled';
  },
});
