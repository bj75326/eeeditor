import React, { CSSProperties, useContext, ReactNode, MouseEvent } from 'react';
import { PluginMethods, EEEditorContext, BlockMapBuilder } from '../../..';
import lang, { Languages, Locale, zhCN } from '../../../locale';
import { AtomicBlockProps } from '..';
import { Tooltip, message } from 'antd';
import { copyIcon } from '../../../assets/extraIcons';
import randomizeBlockMapKeys from 'draft-js/lib/randomizeBlockMapKeys';
import classNames from 'classnames';

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
  } = props;

  const { block } = getBlockProps();

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  const handleBtnClick = (e: MouseEvent) => {
    e.preventDefault();
    const editorRef = getEditorRef();

    try {
      navigator.clipboard
        // @ts-ignore
        .write([
          // @ts-ignore
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
        .catch(() => {
          message.open({
            content:
              locale['eeeditor.block.toolbar.copy.error.msg'] ||
              'eeeditor.block.toolbar.copy.error.msg',
            type: 'error',
            duration: 3,
            className: `${prefixCls}-message`,
          });
        });
    } catch (err) {
      message.open({
        content:
          locale['eeeditor.block.toolbar.copy.error.msg'] ||
          'eeeditor.block.toolbar.copy.error.msg',
        type: 'error',
        duration: 3,
        className: `${prefixCls}-message`,
      });
    }

    editorRef.setClipboard(
      randomizeBlockMapKeys(BlockMapBuilder.createFromArray([block])),
    );
  };

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  const btnCls = classNames(`${prefixCls}-popover-button`, className);

  return (
    <Tooltip
      title={getTipTitle('eeeditor.block.toolbar.copy.button.tip')}
      placement={placement}
      overlayClassName={`${prefixCls}-tip-wrapper`}
    >
      <span className={btnCls} style={style} onClick={handleBtnClick}>
        {copyIcon}
      </span>
    </Tooltip>
  );
};

export const CopyButton: React.FC<CopyButtonProps> = (props) => (
  <CopyButtonComponent {...props} />
);

export default CopyButton;
