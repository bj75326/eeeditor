import React, {
  CSSProperties,
  useContext,
  ReactNode,
  MouseEvent,
  useEffect,
} from 'react';
import { PluginMethods, EEEditorContext } from '../../..';
import lang, { Languages, Locale, zhCN } from '../../../locale';
import { AtomicBlockProps } from '../';
import { Tooltip, message } from 'antd';
import { copyIcon } from '../../../assets/extraIcons';
import getContentStateFragment from 'draft-js/lib/getContentStateFragment';
import Clipboard from 'clipboard';

export interface CopyButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  languages?: Languages;
}

export interface CopyButtonExtraProps extends Partial<PluginMethods> {
  placement?: 'top' | 'bottom';
  getBlockProps?: () => Partial<AtomicBlockProps>;
}

const CopyButtonComponent: React.FC<CopyButtonProps & CopyButtonExtraProps> = (
  props,
) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    languages = lang,
    placement,
    getBlockProps,
    getProps,
    getEditorRef,
    getEditorState,
    setEditorState,
  } = props;

  const { block, offsetKey } = getBlockProps();

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  const handleBtnClick = (e: MouseEvent) => {
    e.preventDefault();
    const editorState = getEditorState();
    const editorRef = getEditorRef();

    // if (editorState.getSelection().isCollapsed()) {
    //   return;
    // }
    // try {
    // const data = new DataTransfer();
    // data.setData('text/html', '<img src="xxxxxxxxxxx"/>')
    navigator.clipboard
      .write([
        new ClipboardItem({
          // 加入 text 使 dataTransfer.isRichText === true
          'text/plain': new Blob(['eeeditor.atomic-block.paste'], {
            type: 'text/plain',
          }),
          // 加入 data-editor 使 editOnPaste 使用 internalClipboard 直接插入 fragment, 如果使用自定义 handlePastedText，不添加 data-editor 也可以
          'text/html': new Blob(
            [
              `<figure data-block="true" data-editor="${getEditorRef().getEditorKey()}"></figure>`,
            ],
            { type: 'text/html' },
          ),
        }),
      ])
      .then(() => {
        message.open({
          content:
            locale['eeeditor.block.toolbar.copy.success.msg'] ||
            'eeeditor.block.toolbar.copy.success.msg',
          type: 'info',
          duration: 3,
          className: `${prefixCls}-message`,
        });
      })
      .catch((err) => {
        console.log(err);
        message.open({
          content:
            locale['eeeditor.block.toolbar.copy.error.msg'] ||
            'eeeditor.block.toolbar.copy.error.msg',
          type: 'error',
          duration: 3,
          className: `${prefixCls}-message`,
        });
      });

    editorRef.setClipboard(
      getContentStateFragment(
        editorState.getCurrentContent(),
        editorState.getSelection(),
      ),
    );
    // } catch (err) {
    //   message.open({
    //     content:
    //       locale['eeeditor.block.toolbar.copy.error.msg'] ||
    //       'eeeditor.block.toolbar.copy.error.msg',
    //     type: 'error',
    //     duration: 3,
    //     className: `${prefixCls}-message`,
    //   });
    // }

    // message.open({
    //   content:
    //     locale['eeeditor.block.toolbar.copy.success.msg'] ||
    //     'eeeditor.block.toolbar.copy.success.msg',
    //   type: 'info',
    //   duration: 3,
    //   className: `${prefixCls}-message`,
    // });
  };

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  return (
    <Tooltip
      title={getTipTitle('eeeditor.block.toolbar.copy.button.tip')}
      placement={placement}
      overlayClassName={`${prefixCls}-tip-wrapper`}
    >
      <span
        className={`${prefixCls}-popover-button`}
        onClick={handleBtnClick}
        id="test"
      >
        {copyIcon}
      </span>
    </Tooltip>
  );
};

export const CopyButton: React.FC<CopyButtonProps> = (props) => (
  <CopyButtonComponent {...props} />
);

export default CopyButton;
