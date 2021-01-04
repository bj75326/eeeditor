import React, { useState, useEffect } from 'react';
import { connect, ConnectProps, useIntl } from 'umi';
import EEEditor, {
  convertFromRaw,
  convertToRaw,
  EditorState,
} from '@/components/eeeditor';
import { StateType } from './model';

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

  const handleChange = (editorState: EditorState) => {
    console.log('Page handleChange run');
    setEditorState(editorState);
    // sync with server side
    if (dispatch) {
      dispatch({
        type: 'draft/syncDraft',
        payload: {
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
