import React, { ComponentType, useEffect } from 'react';
import { Store } from '@draft-js-plugins/utils';

export interface AtomicBlockToolbarDecoratorProps {
  blockProps: {
    isFocused?: boolean;
  };
  offsetKey: string;
  store: Store<{
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

export const BlockToolbarDecorator = (
  WrappedComponent: WrappedComponentType,
): ComponentType<AtomicBlockToolbarDecoratorProps> => {
  const AtomicBlockToolbarDecorator = (
    props: AtomicBlockToolbarDecoratorProps,
  ) => {
    const { store, offsetKey } = props;
    const { isFocused } = props.blockProps;

    // isFocused 的变化改变 image toolbar popover 的显隐状态
    useEffect(() => {
      if (isFocused) {
        store.updateItem('toolbarPopoverOffsetKey', offsetKey);
      } else {
        if (store.getItem('toolbarPopoverOffsetKey') === offsetKey) {
          store.updateItem('toolbarPopoverOffsetKey', '');
        }
      }
    }, [isFocused]);

    return <WrappedComponent {...props} />;
  };

  AtomicBlockToolbarDecorator.displayName = `AtomicBlockToolbar(${getDisplayName(
    WrappedComponent,
  )})`;

  (AtomicBlockToolbarDecorator as any).WrappedComponent =
    WrappedComponent.WrappedComponent || WrappedComponent;

  return AtomicBlockToolbarDecorator;
};
