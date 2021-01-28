import { Effect, Reducer } from 'umi';
import {
  RawDraftContentState,
  EditorState,
  convertToRaw,
} from '@eeeditor/editor';
import { getDraft, syncContent, syncTitle } from './service';

export interface StateType {
  title: string;
  content: RawDraftContentState;
  status?: 'success' | 'failed' | 'in progress';
  statusText?: '';
}

export interface ModelType {
  namespace: 'draft';
  state: StateType;
  effects: {
    fetchDraft: Effect;
    syncContent: Effect;
    syncTitle: Effect;
  };
  reducers: {
    changeDraft: Reducer<StateType>;
    changeStatus: Reducer<StateType>;
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
      yield put({
        type: 'changeStatus',
        payload: {
          status: 'in progress',
          statusText: formatMessage({ id: 'page.fetch.draft.in-progress' }),
        },
      });
      const response = yield call(getDraft, data);
      if (response.status === 'ok') {
        yield put({
          type: 'changeDraft',
          payload: {
            title: response.title,
            content: response.content,
            status: 'success',
            statusText: formatMessage({ id: 'page.fetch.draft.success' }),
          },
        });
      } else {
        yield put({
          type: 'changeStatus',
          payload: {
            status: 'failed',
            statusText: formatMessage({ id: 'page.fetch.draft.failed' }),
          },
        });
      }
    },
    *syncContent({ payload: { formatMessage, ...data } }, { call, put }) {
      yield put({
        type: 'changeStatus',
        payload: {
          status: 'in progress',
          statusText: formatMessage({ id: 'page.sync.draft.in-progress' }),
        },
      });
      const response = yield call(syncContent, data);
      if (response.status === 'ok') {
        yield put({
          type: 'changeStatus',
          payload: {
            status: 'success',
            statusText: formatMessage({ id: 'page.sync.draft.success' }),
          },
        });
      } else {
        yield put({
          type: 'changeStatus',
          payload: {
            status: 'failed',
            statusText: formatMessage({ id: 'page.sync.draft.failed' }),
          },
        });
      }
    },
    *syncTitle({ payload: { formatMessage, ...data } }, { call, put }) {
      yield put({
        type: 'changeStatus',
        payload: {
          status: 'in progress',
          statusText: formatMessage({ id: 'page.sync.title.in-progress' }),
        },
      });
      const response = yield call(syncTitle, data);
      if (response.status === 'ok') {
        yield put({
          type: 'changeStatus',
          payload: {
            status: 'success',
            statusText: formatMessage({ id: 'page.sync.title.success' }),
          },
        });
      } else {
        yield put({
          type: 'changeStatus',
          payload: {
            status: 'failed',
            statusText: formatMessage({ id: 'page.sync.title.failed' }),
          },
        });
      }
    },
  },
  reducers: {
    changeDraft(state, { payload }) {
      return {
        ...state,
        title: payload.title,
        content: payload.content,
        status: payload.status,
        statusText: payload.statusText,
      };
    },
    changeStatus(state, { payload }) {
      return {
        ...(state as StateType),
        status: payload.status,
        statusText: payload.statusText,
      };
    },
  },
};

export default Modal;
