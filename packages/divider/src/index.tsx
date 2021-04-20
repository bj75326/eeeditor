import React, { ComponentType } from 'react';
import { EditorPlugin } from '@eeeditor/editor';
import Divider, { DividerProps } from './components/Divider';
import DividerButton, {
  DividerButtonProps,
  DividerButtonExtraProps,
} from './components/DividerButton';
import addDivider from './modifiers/addDivider';

export interface Locale {
  'eeeditor.divider.button.tip.name'?: string;
  'eeeditor.divider.button.tip.shortcut'?: string;
}

interface DividerPluginConfig {
  entityType?: string;
  dividerComponent?: ComponentType<DividerProps>;
  dividerButtonComponent?: ComponentType<
    DividerButtonProps & DividerButtonExtraProps
  >;
  decorator?: unknown;
}

const createDividerPlugin = ({
  entityType = 'divider',
  dividerComponent = Divider,
  dividerButtonComponent: Button = DividerButton,
  decorator,
}: DividerPluginConfig): EditorPlugin & {
  DividerButton: ComponentType<DividerButtonProps>;
  addDivider: ReturnType<typeof addDivider>;
} => {
  let Divider = dividerComponent;

  if (typeof decorator === 'function') {
    Divider = decorator(Divider);
  }

  const DividerButton: React.FC<DividerButtonProps> = (props) => (
    <Button {...props} addDivider={addDivider(entityType)} />
  );

  return {
    blockRendererFn(block, { getEditorState }) {
      if (block.getType() === 'atomic') {
        const contentState = getEditorState().getCurrentContent();
        const entity = block.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
      }

      return null;
    },

    DividerButton,

    addDivider: addDivider(entityType),
  };
};
