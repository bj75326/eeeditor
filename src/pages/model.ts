import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import {
  RawDraftContentState,
  EditorState,
  convertToRaw,
} from '@/components/eeeditor';
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
      const response = yield call(syncContent, data);
      if (response.status === 'ok') {
        // 示例使用dva-loading更新同步文稿的状态，如果不使用dva-loading，
        // 则需要考虑在这里修改特定state的值以使同步状态在页面上展示。
      } else {
        //message.error(formatMessage({ id: 'page.sync.draft.failed' }));
      }
    },
    *syncTitle({ payload: { formatMessage, ...data } }, { call, put }) {
      const response = yield call(syncTitle, data);
      if (response.status === 'ok') {
        // 示例使用dva-loading更新同步标题的状态，如果不使用dva-loading，
        // 则需要考虑在这里修改特定state的值以使同步状态在页面上展示。
      } else {
        //message.error(formatMessage({ id: 'page.sync.title.failed' }));
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
