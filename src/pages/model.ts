import { Effect, Reducer } from 'umi';
import { message, notification } from 'antd';
import {
  RawDraftContentState,
  EditorState,
  convertToRaw,
} from '@/components/eeeditor';
import { getDraft } from './service';

export interface StateType {
  title: string;
  content: RawDraftContentState;
}

export interface ModelType {
  namespace: 'draft';
  state: StateType;
  effects: {
    fetchDraft: Effect;
  };
  reducers: {
    changeDraft: Reducer<StateType>;
  };
}

const Modal: ModelType = {
  namespace: 'draft',
  state: {
    title: '',
    content: convertToRaw(EditorState.createEmpty().getCurrentContent()),
  },
  effects: {
    *fetchDraft({ payload }, { call, put }) {
      const response = yield call(getDraft, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'changeDraft',
          payload: response,
        });
      } else if (response.status === 'error') {
        message.error('Fetch draft error!');
      }
    },
  },
  reducers: {
    changeDraft(state, { payload }) {
      return {
        ...state,
        title: payload.title,
        content: payload.content,
      };
    },
  },
};

export default Modal;
