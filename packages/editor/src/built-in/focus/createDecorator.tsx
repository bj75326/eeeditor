import React, {
  ComponentType,
  MouseEvent,
  ReactElement,
  Ref,
  useEffect,
} from 'react';
import { ContentBlock, BlockKeyStore, blockInSelection } from '../..';
import classNames from 'classnames';

interface DecoratorProps {
  blockKeyStore: BlockKeyStore;
}

export interface BlockFocusDecoratorProps {
  className: string;
  blockProps: {
    isFocused?: boolean;
    setFocusToBlock?: () => void;
  };
  block: ContentBlock;
  //onClick(event: MouseEvent): void;
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
    const BlockFocusDecorator = React.forwardRef(
      (props: BlockFocusDecoratorProps, ref): ReactElement => {
        useEffect(() => {
          blockKeyStore.add(props.block.getKey());
          return () => {
            blockKeyStore.remove(props.block.getKey());
          };
        }, []);

        return <WrappedComponent {...props} ref={ref} />;
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
