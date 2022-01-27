import {
  ContentBlock,
  ContentState,
  EditorState,
  Modifier,
  SelectionState,
} from '@eeeditor/editor';
import Immutable from 'immutable';

const updateCropPositions = (
  editorState: EditorState,
  block: ContentBlock,
  data: object,
): EditorState => {
  // selectionBefore 更改为目标 block
  const targetSelection = SelectionState.createEmpty(block.getKey()).merge({
    hasFocus: true,
    isBackward: false,
  });

  const afterMergeBlockData = Modifier.mergeBlockData(
    editorState.getCurrentContent(),
    targetSelection,
    Immutable.Map<string, string>(data),
  );

  // 将 selectionAfter 改成当前 selection
  const changedSelectionAfter = afterMergeBlockData.merge({
    selectionAfter: editorState.getSelection(),
  }) as ContentState;

  // 将 selectionBefore 改成目标 block
  const changedSelectionBefore = EditorState.forceSelection(
    editorState,
    targetSelection,
  );

  return EditorState.push(
    changedSelectionBefore,
    changedSelectionAfter,
    'change-block-data',
  );
};

export default updateCropPositions;
