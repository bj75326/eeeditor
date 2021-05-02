import {
  EditorState,
  BlockMap,
  BlockMapBuilder,
  ContentState,
  Modifier,
  CharacterMetadata,
  genKey,
  ContentBlock,
  SelectionState,
  isFirstBlock,
  isLastBlock,
} from '..';
import { List, Repeat } from 'immutable';

const checkSelectionAfter = (
  withAtomicBlock: ContentState,
  dividerBlockNeeded: boolean,
): SelectionState => {
  // todo
  return;
};

export const insertAtomicBlockWithoutSplit = (
  editorState: EditorState,
  entityKey: string,
  character: string,
): EditorState => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const afterRemoval = Modifier.removeRange(
    contentState,
    selectionState,
    'backward',
  );

  const targetSelection = afterRemoval.getSelectionAfter();

  const startKey = targetSelection.getStartKey();
  const currentBlock = afterRemoval.getBlockForKey(startKey);

  const charData = CharacterMetadata.create({ entity: entityKey });
  const atomicBlockConfig = {
    key: genKey(),
    type: 'atomic',
    text: character,
    characterList: List(Repeat(charData, character.length)),
  };

  const atomicDividerBlockConfig = {
    key: genKey(),
    type: 'unstyled',
  };

  let asAtomicBlock: ContentState = null;
  let fragmentArray: Array<ContentBlock> = [
    new ContentBlock(atomicBlockConfig),
  ];
  let fragment: BlockMap = null;
  let withAtomicBlock: ContentState = null;

  if (
    (currentBlock.getType() === 'unstyled' ||
      currentBlock.getType() === 'paragraph') &&
    !!!currentBlock.getText() &&
    !isFirstBlock(startKey, afterRemoval)
  ) {
    asAtomicBlock = Modifier.setBlockType(
      afterRemoval,
      targetSelection,
      'atomic',
    );

    if (isLastBlock(startKey, afterRemoval)) {
      fragmentArray.push(new ContentBlock(atomicDividerBlockConfig));
    }

    fragment = BlockMapBuilder.createFromArray(fragmentArray);

    withAtomicBlock = Modifier.replaceWithFragment(
      asAtomicBlock,
      targetSelection,
      fragment,
    );

    // return EditorState.push(editorState, withAtomicBlock.merge({
    //   selectionBefore: selectionState,
    //   // selectionAfter:
    // }), 'insert-fragment');
  }

  const afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);

  let insertionTarget = afterSplit.getSelectionAfter();
  const insertionTargetBlock = afterSplit.getBlockForKey(insertionTarget);

  return;
};

export default insertAtomicBlockWithoutSplit;
