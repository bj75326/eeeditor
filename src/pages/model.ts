import { Effect, Reducer } from 'umi';
import { message, notification } from 'antd';
import {
  RawDraftContentState,
  EditorState,
  convertToRaw,
} from '@/components/eeeditor';

export interface StateType {
  title: string;
  content: RawDraftContentState;
}

export interface ModelType {
  namespace: 'page';
  state: StateType;
}

const Modal: ModelType = {
  namespace: 'page',
  state: {
    title: '',
    content: convertToRaw(EditorState.createEmpty().getCurrentContent()),
  },
};

export default Modal;
