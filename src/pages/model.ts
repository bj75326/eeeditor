import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import {
  RawDraftContentState,
  EditorState,
  convertToRaw,
} from '@/components/eeeditor';
import { getDraft, syncDraft } from './service';

export interface StateType {
  title: string;
  content: RawDraftContentState;
}

export interface ModelType {
  namespace: 'draft';
  state: StateType;
  effects: {
    fetchDraft: Effect;
    syncDraft: Effect;
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
    *fetchDraft({ payload: { formatMessage, ...data } }, { call, put }) {
      const response = yield call(getDraft, data);
      if (response.status === 'ok') {
        yield put({
          type: 'changeDraft',
          payload: response,
        });
      } else if (response.status === 'error') {
        message.error(formatMessage({ id: 'page.fetch.draft.failed' }));
      }
    },
    *syncDraft({ payload: { formatMessage, ...data } }, { call, put }) {
      const response = yield call(syncDraft, data);
      if (response.status === 'ok') {
        // 示例使用dva-loading更新同步文稿的状态，如果不使用dva-loading，
        // 则需要考虑在这里修改特定state的值以使同步状态在页面上展示。
      } else if (response.status === 'error') {
        message.error(formatMessage({ id: 'page.sync.draft.failed' }));
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
