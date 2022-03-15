import { EditorState, Modifier } from '@eeeditor/editor';
import Immutable from 'immutable';

const resetCrop = (editorState: EditorState): EditorState => {
  const afterResetCrop = Modifier.mergeBlockData(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    Immutable.Map<string, string | number>({
      cropBasedWidth: null,
      cropTl: null,
      cropT: null,
      cropTr: null,
      cropL: null,
      cropR: null,
      cropBl: null,
      cropB: null,
      cropBr: null,
    }),
  );

  return EditorState.push(editorState, afterResetCrop, 'change-block-data');
};

export default resetCrop;
