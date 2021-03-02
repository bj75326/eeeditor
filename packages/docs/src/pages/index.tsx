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
  EditorPlugin,
} from '@eeeditor/editor';
import createStaticToolbarPlugin, {
  StaticToolbarPlugin,
  StaticToolbarChildrenProps,
  defaultSelectorBtnIcons,
} from '@eeeditor/static-toolbar';
import {
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  HeadlineFourButton,
  HeadlineFiveButton,
  HeadlineSixButton,
} from '@eeeditor/buttons';
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
  Loading,
  CheckOne,
  CloseOne,
  AlignTextLeftOne,
  AlignTextRightOne,
} from '@icon-park/react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { Spin } from 'antd';

import './index.less';

import '@eeeditor/editor/es/style';
import '@eeeditor/static-toolbar/es/style';

const { HeaderButtonIcon } = defaultSelectorBtnIcons;

const {
  StaticToolbar,
  SelectorButton,
  ...staticToolbarPlugin
}: StaticToolbarPlugin = createStaticToolbarPlugin();

const plugins: EditorPlugin[] = [staticToolbarPlugin];

export interface PageProps extends ConnectProps {
  title: StateType['title'];
  content: StateType['content'];
  fetching: boolean;
  status: StateType['status'];
  statusText: StateType['statusText'];
  //syncingContent: boolean;
  //syncingTitle: boolean;
}

const Page: React.FC<PageProps> = (props) => {
  const {
    title: initTitle,
    content,
    dispatch,
    fetching,
    status,
    statusText,
    //syncingContent,
    //syncingTitle,
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

  const handleLocaleChange = () => {
    const currLocale = getLocale();
    if (currLocale === 'zh-CN') {
      setLocale('en-US', false);
    } else {
      setLocale('zh-CN', false);
    }
  };

  const initDirection = localStorage.getItem('direction') === 'rtl';
  const [rtl, setRtl]: [boolean, any] = useState(initDirection);

  const handleDirectionChange = () => {
    setRtl((rtl: boolean) => !rtl);
    localStorage.setItem('direction', !rtl ? 'rtl' : 'ltr');
    const html = document.documentElement;
    if (!rtl) {
      html.classList.remove('ltr');
      html.classList.add('rtl');
      html.dataset['direction'] = 'rtl';
    } else {
      html.classList.remove('rtl');
      html.classList.add('ltr');
      html.dataset['direction'] = 'ltr';
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

  console.log('status: ', status);
  console.log('statusText: ', statusText);
  console.log('fetching: ', fetching);
  console.log('title: ', title);
  console.log('rtl: ', rtl);

  const sidebar = (
    <CSSTransition
      in={!sidebarCollapsed}
      timeout={120}
      classNames="sidebar"
      unmountOnExit
    >
      <aside className="sidebar">
        <div className="sidebarMenu">
          <section className="tools">
            <h3>{formatMessage({ id: 'page.sidebar.tool.section.header' })}</h3>
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
                <span>{formatMessage({ id: 'page.sidebar.tool.theme' })}</span>
              </a>
              <a className="toolBtn" onClick={handleLocaleChange}>
                <International theme="outline" strokeWidth={3} />
                <span>{formatMessage({ id: 'page.sidebar.tool.locale' })}</span>
              </a>
              <a className="toolBtn" onClick={handleDirectionChange}>
                {rtl ? (
                  <AlignTextLeftOne theme="outline" strokeWidth={3} />
                ) : (
                  <AlignTextRightOne theme="outline" strokeWidth={3} />
                )}
                <span>
                  {formatMessage({ id: 'page.sidebar.tool.direction' })}
                </span>
              </a>
            </div>
          </section>
          <section className="mode">
            <h3>{formatMessage({ id: 'page.sidebar.mode.section.header' })}</h3>
          </section>
          <section className="typesetting">
            <h3>
              {formatMessage({
                id: 'page.sidebar.typesetting.section.header',
              })}
            </h3>
          </section>
          <section className="help">
            <h3>{formatMessage({ id: 'page.sidebar.help.section.header' })}</h3>
          </section>
        </div>
      </aside>
    </CSSTransition>
  );

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
          <div className="status">
            {status === 'failed' && (
              <CloseOne theme="outline" strokeWidth={3} />
            )}
            {status === 'in progress' && (
              <Loading theme="outline" strokeWidth={3} />
            )}
            {status === 'success' && (
              <CheckOne theme="outline" strokeWidth={3} />
            )}
            {statusText && <span>{statusText}</span>}
          </div>
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
      </header>
      <Spin
        indicator={<Loading theme="outline" strokeWidth={3} />}
        wrapperClassName="spin"
        spinning={fetching}
      >
        <div className="editor">
          <div
            className="transformWrapper"
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
            <EEEditor
              editorState={editorState}
              onChange={handleChange}
              textDirectionality={rtl ? 'RTL' : 'LTR'}
              placeholder={formatMessage({
                id: 'page.draft.editor.placeholder',
              })}
              plugins={plugins}
            />
          </div>
          <div
            className="transformWrapper staticToolbarWrapper"
            style={{ transform: 'translate3d(0px, 0px, 0px)' }}
          >
            <StaticToolbar>
              {(externalProps: StaticToolbarChildrenProps) => (
                <>
                  <SelectorButton {...externalProps} icon={HeaderButtonIcon}>
                    <HeadlineOneButton {...externalProps} />
                    <HeadlineTwoButton {...externalProps} />
                    <HeadlineThreeButton {...externalProps} />
                    <HeadlineFourButton {...externalProps} />
                    <HeadlineFiveButton {...externalProps} />
                    <HeadlineSixButton {...externalProps} />
                  </SelectorButton>
                </>
              )}
            </StaticToolbar>
          </div>
        </div>
        {sidebar}
      </Spin>
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
      effects: { [key: string]: boolean };
    };
  }) => ({
    title: draft.title,
    content: draft.content,
    status: draft.status,
    statusText: draft.statusText,
    fetching: !!loading.effects['draft/fetchDraft'],
    //syncingContent: !!loading.effects['draft/syncContent'],
    //syncingTitle: !!loading.effects['draft/syncTitle'],
  }),
)(Page);
