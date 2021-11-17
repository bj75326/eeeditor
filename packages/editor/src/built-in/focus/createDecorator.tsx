import React, {
  ComponentType,
  ReactElement,
  useEffect,
  useLayoutEffect,
  MouseEvent,
  useContext,
  memo,
} from 'react';
import {
  ContentBlock,
  BlockKeyStore,
  SelectionState,
  ContentState,
  reviseAtomicBlockSelection,
  EEEditorContext,
} from '../..';
import classNames from 'classnames';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import { FocusPluginStore } from '.';

interface DecoratorProps {
  blockKeyStore: BlockKeyStore;
  store: FocusPluginStore;
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

export default ({ blockKeyStore, store }: DecoratorProps) =>
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
        console.log('BlockFocusDecorator run');
        const { getPrefixCls } = useContext(EEEditorContext);
        const prefixCls = getPrefixCls();

        const { isFocused, setFocusToBlock } = props.blockProps;

        const getEditorRef = store.getItem('getEditorRef');

        useEffect(() => {
          blockKeyStore.add(props.block.getKey());
          return () => {
            blockKeyStore.remove(props.block.getKey());
          };
        }, []);

        // 模仿 Leaf component, 加上 reviseSelection 使 forceSelection 可以对 focusable block 使用
        // 目前发现 figure 元素似乎会使 selection 不被限定在 focusable block 上，所以也需要加上 revise
        // Q： 为什么使用 useEffect 而不是 useLayoutEffect?
        // 因为 useLayoutEffect 与 leaf component didUpdate 同批次执行，不能保证 selection 被限制在
        // focusable block 内
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
          [`${prefixCls}-isFocused`]: isFocused,
          [`${prefixCls}-isUnfocused`]: !isFocused,
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
          console.log('blockProps isFocused not same');
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
          console.log('entity data not same');
          return false;
        }

        // 比较 block data
        console.log(
          'prevProps.block !== nextProps.block ',
          prevProps.block !== nextProps.block,
        );
        if (prevProps.block !== nextProps.block) {
          return false;
        }

        console.log('props are the same');
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
