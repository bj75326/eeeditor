import { EditorState, DraftBlockType, DraftInlineStyle } from 'draft-js';
import { EEEditorButtonType } from '..';

export interface StrategyType {
  block?: string[];
  inline?: string[];
}

const defaultDisableStrategy: Record<EEEditorButtonType, StrategyType> = {
  header: {
    block: ['atomic'],
    inline: [],
  },
  'ordered-list-item': {
    block: ['atomic'],
    inline: [],
  },
};

const shouldButtonDisabled = (
  editorState: EditorState,
  buttonType: EEEditorButtonType,
  disableStrategy: Record<
    EEEditorButtonType,
    StrategyType
  > = defaultDisableStrategy,
) => {
  const strategy: StrategyType = disableStrategy[buttonType] || {};
  const currentBlock = editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getStartKey());
  const currentBlockType: DraftBlockType = currentBlock.getType();
  const currentInlineStyle: DraftInlineStyle = currentBlock.getInlineStyleAt(
    editorState.getSelection().getStartOffset(),
  );
  if (
    strategy.block &&
    strategy.block.length > 0 &&
    strategy.block.some((block) => block === currentBlockType)
  ) {
    return true;
  }
  // todo: 行内样式对 buttons 状态的影响
  if (strategy.inline && strategy.inline.length > 0) {
    return true;
  }
  return false;
};

export default shouldButtonDisabled;
