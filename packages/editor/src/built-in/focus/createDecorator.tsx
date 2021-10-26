import React, {
  ComponentType,
  ReactElement,
  Ref,
  useEffect,
  memo,
} from 'react';
import {
  ContentBlock,
  BlockKeyStore,
  SelectionState,
  ContentState,
} from '../..';

interface DecoratorProps {
  blockKeyStore: BlockKeyStore;
}

export interface BlockFocusDecoratorProps {
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
  offsetKey: unknown;
  selection: SelectionState;
  tree: unknown;
  contentState: ContentState;
  blockStyleFn: unknown;
  preventScroll: unknown;
  ref: Ref<unknown>;
}

type WrappedComponentType = ComponentType<BlockFocusDecoratorProps> & {
  WrappedComponent?: ComponentType<BlockFocusDecoratorProps>;
};

// Get a component's display name
const getDisplayName = (WrappedComponent: WrappedComponentType): string => {
  const component = WrappedComponent.WrappedComponent || WrappedComponent;
  return component.displayName || component.name || 'Component';
};

export default ({ blockKeyStore }: DecoratorProps) =>
  (
    WrappedComponent: WrappedComponentType,
  ): ComponentType<BlockFocusDecoratorProps> => {
    const MemoComponent = memo(WrappedComponent, (prevProps, nextProps) => {
      console.log('focus plugin shouldComponentUpdate');
      const prevSelection = prevProps.selection;
      const nextSelection = nextProps.selection;
      if (
        prevSelection.getAnchorKey() === nextSelection.getAnchorKey() &&
        prevSelection.getAnchorOffset() === nextSelection.getAnchorOffset() &&
        prevSelection.getFocusKey() === nextSelection.getFocusKey() &&
        prevSelection.getFocusOffset() === nextSelection.getFocusOffset() &&
        prevSelection.getIsBackward() === nextSelection.getIsBackward() &&
        prevSelection.getHasFocus() === false &&
        nextSelection.getHasFocus() === true
      ) {
        return true;
      }
    });
    const BlockFocusDecorator = React.forwardRef(
      (props: BlockFocusDecoratorProps, ref): ReactElement => {
        useEffect(() => {
          blockKeyStore.add(props.block.getKey());
          return () => {
            blockKeyStore.remove(props.block.getKey());
          };
        }, []);

        return <MemoComponent {...props} ref={ref} />;
      },
    );

    BlockFocusDecorator.displayName = `BlockFocus(${getDisplayName(
      WrappedComponent,
    )})`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (BlockFocusDecorator as any).WrappedComponent =
      WrappedComponent.WrappedComponent || WrappedComponent;

    return BlockFocusDecorator;
  };
