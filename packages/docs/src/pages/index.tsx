import React, { useState, useEffect, MouseEvent } from 'react';
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
import createStaticToolbarPlugin from '@eeeditor/static-toolbar';
import createInlineToolbarPlugin from '@eeeditor/inline-toolbar';
import createSideToolbarPlugin from '@eeeditor/side-toolbar';
import createUndoPlugin from '@eeeditor/undo';
import createDividerPlugin from '@eeeditor/divider';
import createAnchorPlugin from '@eeeditor/anchor';
import {
  defaultHeadIcon,
  defaultAlignLeftIcon,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  HeadlineFourButton,
  HeadlineFiveButton,
  HeadlineSixButton,
  BoldButton,
  CodeButton,
  UnderlineButton,
  ItalicButton,
  StrikethroughButton,
  OrderedListButton,
  UnorderedListButton,
  BlockquoteButton,
  AlignCenterButton,
  AlignJustifyButton,
  AlignLeftButton,
  AlignRightButton,
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
  Terminal,
} from '@icon-park/react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { Spin, Select } from 'antd';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import prettier from 'prettier/esm/standalone.mjs';
import parserBabel from 'prettier/esm/parser-babel.mjs';

import './index.less';

import '@eeeditor/editor/es/style';
import '@eeeditor/static-toolbar/es/style';
import '@eeeditor/divider/es/style';
import '@eeeditor/anchor/es/style';
import '@eeeditor/inline-toolbar/es/style';
import '@eeeditor/side-toolbar/es/style';

SyntaxHighlighter.registerLanguage('json', json);

const { Option } = Select;

const { StaticToolbar, SelectorButton, Separator, ...staticToolbarPlugin } =
  createStaticToolbarPlugin();

const { SideToolbar, ...sideToolbarPlugin } = createSideToolbarPlugin();

const {
  InlineToolbar,
  OverrideButton,
  Separator: ISeparator,
  ...inlineToolbarPlugin
} = createInlineToolbarPlugin();

const { DecoratedUndoButton, DecoratedRedoButton, ...undoPlugin } =
  createUndoPlugin({});

const { DividerButton, ...dividerPlugin } = createDividerPlugin({});

const { LinkButton, ...anchorPlugin } = createAnchorPlugin({});

const plugins: EditorPlugin[] = [
  staticToolbarPlugin,
  inlineToolbarPlugin,
  sideToolbarPlugin,
  undoPlugin,
  dividerPlugin,
  anchorPlugin,
];

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

  // sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [rawSidebarCollapsed, setRawSidebarCollapsed] = useState<boolean>(true);
  const handleCollapseBtnClick = () => {
    if (sidebarCollapsed && rawSidebarCollapsed) {
      setSidebarCollapsed(false);
    } else {
      if (!sidebarCollapsed) setSidebarCollapsed(true);
      if (!rawSidebarCollapsed) setRawSidebarCollapsed(true);
    }
  };
  const handleRawBtnClick = () => {
    setRawSidebarCollapsed(false);
    setSidebarCollapsed(true);
  };

  // theme
  const initDarkMode = localStorage.getItem('theme') === 'dark' ? true : false;
  const [darkMode, setDarkMode] = useState<boolean>(initDarkMode);
  const handleThemeChange = (e: MouseEvent) => {
    let nextTheme = 'light';
    if (e.currentTarget.classList.contains('darkTheme')) {
      nextTheme = 'dark';
    } else {
      nextTheme = 'light';
    }
    setDarkMode(nextTheme === 'dark');

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  };

  // editorState
  const [editorState, setEditorState] = useState<EditorState>(
    content
      ? EditorState.createWithContent(convertFromRaw(content))
      : EditorState.createEmpty(),
  );
  const handleChange = (nextEditorState: EditorState) => {
    console.log('Page handleChange run');
    setEditorState(nextEditorState);
    console.log('forceSelection: ', nextEditorState.mustForceSelection());
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
    // console.log('raw: ', convertToRaw(nextContentState));
    if (dispatch && !is(currContentState, nextContentState)) {
      // console.log('xxx', convertToRaw(nextContentState));
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

  // titie
  const [title, setTitle] = useState<string>(initTitle);
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

  // mode
  const initInlineMode =
    localStorage.getItem('mode') === 'inline' ? true : false;
  const [inlineMode, setInlineMode] = useState<boolean>(initInlineMode);
  const handleModeChange = (e: MouseEvent) => {
    let nextMode = 'static';
    if (e.currentTarget.classList.contains('inlineMode')) {
      nextMode = 'inline';
    } else {
      nextMode = 'static';
    }
    setInlineMode(nextMode === 'inline');

    localStorage.setItem('mode', nextMode);
  };

  // locale
  const handleLocaleChange = (value) => {
    // const currLocale = getLocale();
    // if (currLocale === 'zh-CN') {
    //   setLocale('en-US', false);
    // } else {
    //   setLocale('zh-CN', false);
    // }
    // umi locale
    setLocale(value, false);
  };

  const initDirection = localStorage.getItem('direction') === 'rtl';
  const [rtl, setRtl] = useState<boolean>(initDirection);

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
    console.log('didMount decorator ----> ', editorState.getDecorator());
  }, []);

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
    if (status === 'success') {
      console.log('after get init contentState RAW');
      setEditorState(EditorState.createWithContent(convertFromRaw(content)));
    }
  }, [content]);

  useEffect(() => {
    if (status === 'success') {
      console.log('after get init title');
      setTitle(initTitle);
    }
  }, [initTitle]);

  console.log('status: ', status);
  console.log('statusText: ', statusText);
  console.log('fetching: ', fetching);
  console.log('title: ', title);
  console.log('rtl: ', rtl);

  const selectBtnChildrenTip: Partial<Omit<TooltipPropsWithTitle, 'title'>> = {
    placement: rtl ? 'left' : 'right',
  };
  // const staticToolbarBtnTip: Partial<Omit<TooltipPropsWithTitle, 'title'>> = {
  //   placement: 'bottom',
  // };

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
              {/* <a className="toolBtn" onClick={handleThemeChange}>
                {darkMode ? (
                  <Sun theme="outline" strokeWidth={3} />
                ) : (
                  <Moon theme="outline" strokeWidth={3} />
                )}
                <span>{formatMessage({ id: 'page.sidebar.tool.theme' })}</span>
              </a> */}
              {/* <a className="toolBtn" onClick={handleLocaleChange}>
                <International theme="outline" strokeWidth={3} />
                <span>{formatMessage({ id: 'page.sidebar.tool.locale' })}</span>
              </a> */}
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
              <a className="toolBtn" onClick={handleRawBtnClick}>
                <Terminal theme="outline" strokeWidth={3} />
                <span>{formatMessage({ id: 'page.sidebar.tool.raw' })}</span>
              </a>
            </div>
          </section>
          <section className="theme">
            <h3>
              {formatMessage({ id: 'page.sidebar.theme.section.header' })}
            </h3>
            <div>
              <a
                className="checkBtn lightTheme"
                data-checked={!darkMode}
                onClick={handleThemeChange}
              >
                <i></i>
                <label>
                  {formatMessage({ id: 'page.sidebar.theme.label.light' })}
                </label>
              </a>
              <a
                className="checkBtn darkTheme"
                data-checked={darkMode}
                onClick={handleThemeChange}
              >
                <i></i>
                <label>
                  {formatMessage({ id: 'page.sidebar.theme.label.dark' })}
                </label>
              </a>
            </div>
          </section>
          <section className="mode">
            <h3>{formatMessage({ id: 'page.sidebar.mode.section.header' })}</h3>
            <div>
              <a
                className="checkBtn staticMode"
                data-checked={!inlineMode}
                onClick={handleModeChange}
              >
                <i></i>
                <label>
                  {formatMessage({ id: 'page.sidebar.mode.label.static' })}
                </label>
              </a>
              <a
                className="checkBtn inlineMode"
                data-checked={inlineMode}
                onClick={handleModeChange}
              >
                <i></i>
                <label>
                  {formatMessage({ id: 'page.sidebar.mode.label.inline' })}
                </label>
              </a>
            </div>
          </section>
          <section className="locale">
            <h3>
              {formatMessage({ id: 'page.sidebar.locale.section.header' })}
            </h3>
            <Select
              className="localeSelector"
              onChange={handleLocaleChange}
              defaultValue={getLocale()}
              getPopupContainer={() => document.querySelector('.sidebarMenu')}
            >
              <Option value="zh-CN">简体中文</Option>
              <Option value="en-US">English</Option>
            </Select>
          </section>
          <section className="help">
            <h3>{formatMessage({ id: 'page.sidebar.help.section.header' })}</h3>
          </section>
        </div>
      </aside>
    </CSSTransition>
  );

  const rawSidebar = (
    <CSSTransition
      in={!rawSidebarCollapsed}
      timeout={120}
      classNames="sidebar"
      unmountOnExit
    >
      <aside className="sidebar rawSidebar">
        <div className="raw">
          <SyntaxHighlighter
            className="language-json"
            language="json"
            wrapLongLines
            useInlineStyles={false}
          >
            {prettier.format(
              JSON.stringify(convertToRaw(editorState.getCurrentContent())),
              {
                parser: 'json',
                plugins: [parserBabel],
              },
            )}
          </SyntaxHighlighter>
        </div>
      </aside>
    </CSSTransition>
  );

  console.log('entityMap test ', editorState.getCurrentContent());
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
              locale={getLocale().replace('-', '_')}
            />
          </div>
          <div
            className="transformWrapper staticToolbarWrapper"
            style={{
              transform: `translate3d(0px, ${inlineMode ? -40 : 0}px, 0px)`,
            }}
          >
            <StaticToolbar>
              <BoldButton />
              <ItalicButton />
              <UnderlineButton />
              <StrikethroughButton />
              <CodeButton />
              <LinkButton />
              <Separator />
              <SelectorButton
                icon={defaultHeadIcon}
                childrenTipProps={selectBtnChildrenTip}
              >
                <HeadlineOneButton />
                <HeadlineTwoButton />
                <HeadlineThreeButton />
                <HeadlineFourButton />
                <HeadlineFiveButton />
                <HeadlineSixButton />
              </SelectorButton>
              <SelectorButton childrenTipProps={selectBtnChildrenTip}>
                <AlignLeftButton />
                <AlignCenterButton />
                <AlignRightButton />
                <AlignJustifyButton />
              </SelectorButton>
              <UnorderedListButton />
              <OrderedListButton />
              <BlockquoteButton />
              <DividerButton />
              <Separator />
              <DecoratedUndoButton />
              <DecoratedRedoButton />
            </StaticToolbar>
          </div>
          {inlineMode && (
            <>
              <InlineToolbar>
                <BoldButton />
                <ItalicButton />
                <UnderlineButton />
                <StrikethroughButton />
                <CodeButton />
                <LinkButton />
                <ISeparator />
                <OverrideButton icon={defaultHeadIcon}>
                  <HeadlineOneButton />
                  <HeadlineTwoButton />
                  <HeadlineThreeButton />
                  <HeadlineFourButton />
                  <HeadlineFiveButton />
                  <HeadlineSixButton />
                </OverrideButton>
                <OverrideButton icon={defaultAlignLeftIcon}>
                  <AlignLeftButton />
                  <AlignCenterButton />
                  <AlignRightButton />
                  <AlignJustifyButton />
                </OverrideButton>
                <UnorderedListButton />
                <OrderedListButton />
                <BlockquoteButton />
              </InlineToolbar>
              <SideToolbar>
                <UnorderedListButton />
                <OrderedListButton />
                <BlockquoteButton />
                <DividerButton />
              </SideToolbar>
            </>
          )}
        </div>
        {sidebar}
        {rawSidebar}
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
