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
import { List, Repeat, Map } from 'immutable';

const checkSelectionAfter = (
  withAtomicBlock: ContentState,
  dividerBlockNeeded: boolean,
): SelectionState => {
  if (dividerBlockNeeded) {
    return withAtomicBlock
      .getSelectionAfter()
      .set('hasFocus', true) as SelectionState;
  }
  const blockAfterKey = withAtomicBlock
    .getBlockAfter(withAtomicBlock.getSelectionAfter().getStartKey())
    .getKey();
  return withAtomicBlock.getSelectionAfter().merge({
    anchorKey: blockAfterKey,
    anchorOffset: 0,
    focusKey: blockAfterKey,
    focusOffset: 0,
    isBackward: false,
    hasFocus: true,
  });
};

export const insertAtomicBlockWithoutSplit = (
  editorState: EditorState,
  entityKey: string,
  character: string,
  data?: object,
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
  // console.log('startKey: ', startKey);
  const currentBlock = afterRemoval.getBlockForKey(startKey);

  const charData = CharacterMetadata.create({ entity: entityKey });
  const atomicBlockConfig = {
    key: genKey(),
    type: 'atomic',
    text: character,
    characterList: List(Repeat(charData, character.length)),
    data: Map(),
  };

  // atomic-block-toolbar paste 需要在 insert atomic block 时，复制 block data
  if (data && Object.keys(data).length > 0) {
    atomicBlockConfig.data = Map(data);
  }

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

  // console.log('current block: ', currentBlock);

  if (
    currentBlock.getType() !== 'atomic' &&
    !!!currentBlock.getText() &&
    !isFirstBlock(startKey, afterRemoval)
  ) {
    asAtomicBlock = Modifier.setBlockType(
      afterRemoval,
      targetSelection,
      'atomic',
    );

    if (isLastBlock(startKey, asAtomicBlock)) {
      fragmentArray.push(new ContentBlock(atomicDividerBlockConfig));
    }

    fragment = BlockMapBuilder.createFromArray(fragmentArray);

    withAtomicBlock = Modifier.replaceWithFragment(
      asAtomicBlock,
      targetSelection,
      fragment,
    );

    return EditorState.push(
      editorState,
      withAtomicBlock.merge({
        selectionBefore: selectionState,
        selectionAfter: checkSelectionAfter(
          withAtomicBlock,
          isLastBlock(startKey, asAtomicBlock),
        ),
      }) as ContentState,
      'insert-fragment',
    );
  }

  const afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);

  let insertionTarget = afterSplit.getSelectionAfter();

  // console.log('isnertionTarget: ', insertionTarget.getStartKey());

  const insertionTargetBlock = afterSplit.getBlockForKey(
    insertionTarget.getStartKey(),
  );
  // test
  // return EditorState.push(editorState, afterSplit, 'split-block');

  let dividerBlockNeeded = !!(
    insertionTargetBlock.getText() ||
    (!!!insertionTargetBlock.getText() &&
      isLastBlock(insertionTarget.getStartKey(), afterSplit))
  );

  const prevBlock = afterSplit.getBlockBefore(insertionTarget.getStartKey());

  if (!prevBlock.getText() && !isFirstBlock(prevBlock.getKey(), afterSplit)) {
    insertionTarget = afterSplit.getSelectionBefore();
    dividerBlockNeeded = false;
  }

  if (dividerBlockNeeded) {
    fragmentArray.push(new ContentBlock(atomicDividerBlockConfig));
  }
  fragment = BlockMapBuilder.createFromArray(fragmentArray);

  asAtomicBlock = Modifier.setBlockType(afterSplit, insertionTarget, 'atomic');

  withAtomicBlock = Modifier.replaceWithFragment(
    asAtomicBlock,
    insertionTarget,
    fragment,
  );

  return EditorState.push(
    editorState,
    withAtomicBlock.merge({
      selectionBefore: selectionState,
      selectionAfter: checkSelectionAfter(withAtomicBlock, dividerBlockNeeded),
    }) as ContentState,
    'insert-fragment',
  );
};

export default insertAtomicBlockWithoutSplit;
