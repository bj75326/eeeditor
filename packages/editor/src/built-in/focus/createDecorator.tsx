import React, {
  ComponentType,
  ReactElement,
  useEffect,
  MouseEvent,
  Ref,
  memo,
} from 'react';
import {
  ContentBlock,
  BlockKeyStore,
  SelectionState,
  ContentState,
  reviseAtomicBlockSelection,
} from '../..';
import classNames from 'classnames';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';

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
  // ref: Ref<unknown>;
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
    // forwardRef
    // const BlockFocusDecorator = React.forwardRef(
    //   (props: BlockFocusDecoratorProps, ref): ReactElement => {
    //     const { isFocused, setFocusToBlock } = props.blockProps;

    //     useEffect(() => {
    //       blockKeyStore.add(props.block.getKey());
    //       return () => {
    //         blockKeyStore.remove(props.block.getKey());
    //       };
    //     }, []);

    //     // useEffect(() => {
    //     //   reviseAtomicBlockSelection(

    //     //   );
    //     // });

    //     const onMouseUp = (event: MouseEvent) => {
    //       console.log('onMouseUp run');
    //       setFocusToBlock();
    //     };

    //     const className = classNames({
    //       isFocused: isFocused,
    //       isUnfocused: !isFocused,
    //     });

    //     return (
    //       <WrappedComponent
    //         {...props}
    //         onMouseUp={onMouseUp}
    //         ref={ref}
    //         className={className}
    //       />
    //     );
    //   },
    // );

    // memo
    const BlockFocusDecorator = memo(
      (props: BlockFocusDecoratorProps): ReactElement => {
        const { isFocused, setFocusToBlock } = props.blockProps;

        useEffect(() => {
          blockKeyStore.add(props.block.getKey());
          return () => {
            blockKeyStore.remove(props.block.getKey());
          };
        }, []);

        // 目前发现 figure 元素似乎会使 selection 不被限定在 focusable block 上，所以加上 revise
        useEffect(() => {
          console.log('revise focusable block selection');

          const offsetKey = DraftOffsetKey.encode(props.block.getKey(), 0, 0);
          const node = document.querySelectorAll(
            `[data-offset-key="${offsetKey}"]`,
          )[0].firstChild;

          reviseAtomicBlockSelection(props.selection, props.block, node);
        });

        const onMouseUp = (event: MouseEvent) => {
          console.log('onMouseUp run');
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
            className={className}
          />
        );
      },
      // 如果没有这里的 memo 判断是否需要重新渲染，上面组件 useEffect 内执行的
      // reviseAtomicBlockSelection 会在 onFocus 周期内改变 selection 值，
      // 从而使得 selection 与用户交互发生偏差
      (prevProps, nextProps) => {
        // 比较 blockProps
        if (prevProps.blockProps.isFocused !== nextProps.blockProps.isFocused) {
          return false;
        }
        // 比较 entity data
        const prevEntityData = prevProps.contentState
          .getEntity(prevProps.block.getEntityAt(0))
          .getData();
        const nextEntityData = nextProps.contentState
          .getEntity(nextProps.block.getEntityAt(0))
          .getData();
        if (
          Object.keys(prevEntityData).some(
            (value) => nextEntityData[value] !== prevEntityData[value],
          ) ||
          Object.keys(nextEntityData).some(
            (value) => prevEntityData[value] !== nextEntityData[value],
          )
        ) {
          return false;
        }

        return true;
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
