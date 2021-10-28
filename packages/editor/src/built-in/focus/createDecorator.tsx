import React, {
  ComponentType,
  ReactElement,
  useEffect,
  MouseEvent,
  Ref,
} from 'react';
import {
  ContentBlock,
  BlockKeyStore,
  SelectionState,
  ContentState,
} from '../..';
import classNames from 'classnames';

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

  onMouseUp: (event: MouseEvent) => void;
  ref: Ref<unknown>;
  className: string;
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
    const BlockFocusDecorator = React.forwardRef(
      (props: BlockFocusDecoratorProps, ref): ReactElement => {
        const { isFocused, setFocusToBlock } = props.blockProps;

        useEffect(() => {
          blockKeyStore.add(props.block.getKey());
          return () => {
            blockKeyStore.remove(props.block.getKey());
          };
        }, []);

        const onMouseUp = (event: MouseEvent) => {
          setFocusToBlock();
        };

        const className = classNames({
          isFocused: isFocused,
          isUnfocused: !isFocused,
        });

        return (
          <WrappedComponent
            {...props}
            onMouseUp={onMouseUp}
            ref={ref}
            className={className}
          />
        );
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
