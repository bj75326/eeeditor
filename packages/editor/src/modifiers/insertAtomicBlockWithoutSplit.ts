import {
  EditorState,
  BlockMapBuilder,
  Modifier,
  CharacterMetadata,
  genKey,
  ContentBlock,
} from '..';
import { List, Repeat } from 'immutable';

const insertAtomicBlockWithoutSplit = (
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

  const fragmentArray = [new ContentBlock(atomicBlockConfig)];

  if (currentBlock.getType() === 'unstyled' && currentBlock.getText()) {
  }

  return;
};

export default insertAtomicBlockWithoutSplit;
