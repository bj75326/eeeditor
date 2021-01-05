import React, { useState, useEffect } from 'react';
import { connect, ConnectProps, useIntl } from 'umi';
import EEEditor, {
  convertFromRaw,
  convertToRaw,
  EditorState,
} from '@/components/eeeditor';
import { StateType } from './model';
import { is } from 'immutable';

import './index.less';

export interface PageProps extends ConnectProps {
  title: StateType['title'];
  content: StateType['content'];
  fetching: boolean;
  syncing: boolean;
}

const Page: React.FC<PageProps> = (props) => {
  const { title, content, dispatch, fetching, syncing } = props;
  const { formatMessage } = useIntl();

  const [editorState, setEditorState]: [
    EditorState,
    (editorState: EditorState) => void,
  ] = useState(
    content
      ? EditorState.createWithContent(convertFromRaw(content))
      : EditorState.createEmpty(),
  );

  const handleChange = (nextEditorState: EditorState) => {
    console.log('Page handleChange run');
    setEditorState(nextEditorState);

    // sync with server side
    // editorState 包含 selectionState 和 contentState，selectionState 的改动不应该也不需要与服务器同步
    // contentState 的比较可以选择 '===' 或者 Immutable.is()
    // 区别在于 is() 可以将 Immutable Collection 当做直接量对待，e.g:
    // Immutable.is(Immutable.Map({a: 1}), Immutable.Map({a: 1})) ---> true
    const nextContentState = nextEditorState.getCurrentContent();
    const currContentState = editorState.getCurrentContent();
    console.log(
      '=== 直接比较 contentState: ',
      nextContentState === currContentState,
    );
    console.log(
      'Immutable.is() 比较 contentState: ',
      is(currContentState, nextContentState),
    );

    if (dispatch && !is(currContentState, nextContentState)) {
      dispatch({
        type: 'draft/syncDraft',
        payload: {
          draftId: '000000',
          content: convertToRaw(editorState.getCurrentContent()),

          formatMessage,
        },
      });
    }
  };

  useEffect(() => {
    console.log('ready to fetch init contentState RAW');
    if (dispatch) {
      dispatch({
        type: 'draft/fetchDraft',
        payload: {
          // Draft id or something.
          draftId: '000000',

          formatMessage,
        },
      });
    }
  }, []);

  useEffect(() => {
    console.log('after get init contentState RAW');
    setEditorState(EditorState.createWithContent(convertFromRaw(content)));
  }, [content]);

  return (
    <div className="main">
      <header className="header"></header>
      <div className="editor">
        <div
          className="transform-wrapper"
          style={{ transform: 'translate3d(0px, 0px, 0px)' }}
        >
          <h1 className="title">
            <textarea
              maxLength={20}
              placeholder="标题"
              rows={1}
              style={{ height: '37px' }}
              //value={title}
            ></textarea>
          </h1>
          <EEEditor editorState={editorState} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({
    draft,
    loading,
  }: {
    draft: StateType;
    loading: {
      [key: string]: boolean;
    };
  }) => ({
    title: draft.title,
    content: draft.content,
    fetching: loading['draft/fetchDraft'],
    syncing: loading['draft/syncDraft'],
  }),
)(Page);
