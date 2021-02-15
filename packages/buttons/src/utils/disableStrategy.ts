import { EditorState, DraftBlockType, DraftInlineStyle } from 'draft-js';
import { EEEditorButtonType } from '..';

interface StrategyType {
  blockLevel?: string[];
  inlineLevel?: string[];
}

const disableStrategy: { [key: string]: StrategyType } = {
  header: {
    blockLevel: ['atomic'],
    inlineLevel: [],
  },
};

const shouldButtonDisabled = (
  editorState: EditorState,
  buttonType: EEEditorButtonType,
) => {
  const strategy: StrategyType = disableStrategy[buttonType];
  const currentBlockType: DraftBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getStartKey())
    .getType();
  const currentInlineStyle: DraftInline;
};

export default shouldButtonDisabled;
