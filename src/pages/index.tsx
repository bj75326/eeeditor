import React, { useState, useEffect } from 'react';
import {
  connect,
  ConnectProps,
  useIntl,
  setLocale,
  getLocale,
  Helmet,
} from 'umi';
import EEEditor, {
  convertFromRaw,
  convertToRaw,
  EditorState,
} from '@/components/eeeditor';
import { StateType } from './model';
import { is } from 'immutable';
import logo from '@/assets/logo.svg';
import {
  HamburgerButton,
  Github,
  DataSheet,
  PreviewOpen,
  International,
  Sun,
  Moon,
} from '@icon-park/react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';

import './index.less';

export interface PageProps extends ConnectProps {
  title: StateType['title'];
  content: StateType['content'];
  fetching: boolean;
  syncingContent: boolean;
  syncTitle: boolean;
}

const Page: React.FC<PageProps> = (props) => {
  const {
    title: initTitle,
    content,
    dispatch,
    fetching,
    syncingContent,
    syncTitle,
  } = props;
  const { formatMessage } = useIntl();

  const [sidebarCollapsed, setSidebarCollapsed]: [boolean, any] = useState(
    false,
  );

  const handleCollapseBtnClick = () => {
    setSidebarCollapsed((sidebarCollapsed: boolean) => !sidebarCollapsed);
  };

  const initDarkMode = localStorage.getItem('theme') === 'dark' ? true : false;
  const [darkMode, setDarkMode]: [boolean, any] = useState(initDarkMode);

  const handleThemeChange = () => {
    setDarkMode((darkMode: boolean) => !darkMode);

    const nextTheme = !darkMode ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  };

  const [editorState, setEditorState]: [EditorState, any] = useState(
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
        type: 'draft/syncContent',
        payload: {
          draftId: '000000',
          content: convertToRaw(editorState.getCurrentContent()),

          formatMessage,
        },
      });
    }
  };

  const [title, setTitle]: [string, any] = useState(initTitle);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);

    if (dispatch) {
      dispatch({
        type: 'draft/syncTitle',
        payload: {
          draftId: '000000',
          title: e.target.value,

          formatMessage,
        },
      });
    }
  };

  //const [draftLocale, setDraftLocale]:['zh-CN' | 'en-US', any] = useState(getLocale());

  const handleLocaleChange = () => {
    const currLocale = getLocale();
    if (currLocale === 'zh-CN') {
      setLocale('en-US', false);
    } else {
      setLocale('zh-CN', false);
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
          locale: getLocale(),
          formatMessage,
        },
      });
    }
  }, [getLocale()]);

  useEffect(() => {
    console.log('after get init contentState RAW');
    setEditorState(EditorState.createWithContent(convertFromRaw(content)));
  }, [content]);

  useEffect(() => {
    console.log('after get init title');
    setTitle(initTitle);
  }, [initTitle]);

  return (
    <div className="main">
      <Helmet>
        <title>{title ? `${title} | EEEditor` : 'EEEditor'}</title>
      </Helmet>
      <header className="header">
        <div className="header-body">
          <div className="logo">
            <a href="/">
              <img src={logo} alt="logo" />
              <span>EEEditor</span>
            </a>
          </div>
          <div className="status"></div>
          <div className="actions">
            <span
              role="button"
              className={classNames('actionBtn', 'headerBtn', {
                uncollapsed: !sidebarCollapsed,
              })}
              onClick={handleCollapseBtnClick}
            >
              <HamburgerButton theme="outline" size="18" strokeWidth={3} />
            </span>
            <a href="" className="actionBtn">
              <Github theme="outline" size="24" strokeWidth={3} />
            </a>
          </div>
        </div>
        <CSSTransition
          in={!sidebarCollapsed}
          timeout={120}
          classNames="sidebar"
          unmountOnExit
        >
          <aside className="sidebar">
            <div className="sidebarMenu">
              <section className="tools">
                <h3>
                  {formatMessage({ id: 'page.sidebar.tool.section.header' })}
                </h3>
                <div>
                  <a className="toolBtn">
                    <DataSheet theme="outline" strokeWidth={3} />
                    <span>
                      {formatMessage({ id: 'page.sidebar.tool.wordcount' })}
                    </span>
                  </a>
                  <a className="toolBtn" href="" target="_blank">
                    <PreviewOpen theme="outline" strokeWidth={3} />
                    <span>
                      {formatMessage({ id: 'page.sidebar.tool.preview' })}
                    </span>
                  </a>
                  <a className="toolBtn" onClick={handleThemeChange}>
                    {darkMode ? (
                      <Sun theme="outline" strokeWidth={3} />
                    ) : (
                      <Moon theme="outline" strokeWidth={3} />
                    )}
                    <span>
                      {formatMessage({ id: 'page.sidebar.tool.theme' })}
                    </span>
                  </a>
                  <a className="toolBtn" onClick={handleLocaleChange}>
                    <International theme="outline" strokeWidth={3} />
                    <span>
                      {formatMessage({ id: 'page.sidebar.tool.locale' })}
                    </span>
                  </a>
                </div>
              </section>
              <section className="mode">
                <h3>
                  {formatMessage({ id: 'page.sidebar.mode.section.header' })}
                </h3>
              </section>
              <section className="typesetting">
                <h3>
                  {formatMessage({
                    id: 'page.sidebar.typesetting.section.header',
                  })}
                </h3>
              </section>
              <section className="help">
                <h3>
                  {formatMessage({ id: 'page.sidebar.help.section.header' })}
                </h3>
              </section>
            </div>
          </aside>
        </CSSTransition>
      </header>
      <div className="editor">
        <div
          className="transform-wrapper"
          style={{ transform: 'translate3d(0px, 0px, 0px)' }}
        >
          <h1 className="title">
            <textarea
              maxLength={50}
              placeholder={formatMessage({
                id: 'page.draft.title.placeholder',
              })}
              rows={1}
              style={{ height: '37px' }}
              value={title}
              onChange={handleTitleChange}
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
    syncingContent: loading['draft/syncContent'],
    syncingTitle: loading['draft/syncTitle'],
  }),
)(Page);