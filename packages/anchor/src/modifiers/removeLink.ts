import { EditorState } from '@eeeditor/editor';
import EditorUtil from '@draft-js-plugins/utils';

const removeLink = (editorState: EditorState): EditorState => {
  return EditorUtil.removeLinkAtSelection(editorState);
};

export default removeLink;
