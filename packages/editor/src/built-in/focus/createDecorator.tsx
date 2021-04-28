import React, {
  ComponentType,
  MouseEvent,
  ReactElement,
  Ref,
  useEffect,
} from 'react';
import { ContentBlock } from '../..';
import classNames from 'classnames';
import { BlockKeyStore } from './utils/createBlockKeyStore';

interface DecoratorProps {
  blockKeyStore: BlockKeyStore;
}

export interface BlockFocusDecoratorProps {
  className: string;
  blockProps: {
    isFocused: boolean;
    setFocusToBlock(): void;
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

export default ({ blockKeyStore }: DecoratorProps) => (
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

      // custom block component 参照 DraftEditorLeaf setDraftEditorSelection 在 useEffect(didUpdate&didMount) 时重新计算 selection，因此不再需要在 decorator 里添加 click 事件来手动 focus
      // const onClick = (evt: MouseEvent): void => {
      //   evt.preventDefault();
      //   if (!props.blockProps.isFocused) {
      //     props.blockProps.setFocusToBlock();
      //   }
      // };

      const { blockProps, className } = props;
      const { isFocused } = blockProps;
      const combinedClassName = classNames(className, {
        isFocused: !!isFocused,
      });
      return (
        <WrappedComponent
          {...props}
          ref={ref}
          // onClick={onClick}
          className={combinedClassName}
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
