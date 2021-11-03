import React, {
  ReactNode,
  CSSProperties,
  useContext,
  MouseEvent,
  useEffect,
} from 'react';
import classNames from 'classnames';
import {
  EditorState,
  KeyCommand,
  PluginMethods,
  EditorPlugin,
  EEEditorContext,
  checkKeyCommand,
  ContentBlock,
  DraftBlockType,
} from '@eeeditor/editor';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import { Languages, zhCN, Locale } from '..';
import { Tooltip, Upload, UploadProps } from 'antd';

export const defaultImageIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <rect
        width="48"
        height="48"
        fill="none"
        fillOpacity="0.01"
        strokeLinejoin="bevel"
        strokeWidth="3"
        stroke="none"
        fillRule="evenodd"
      />
      <g transform="translate(5.000000, 8.000000)">
        <path
          d="M2,0 L36,0 C37.1045695,-2.02906125e-16 38,0.8954305 38,2 L38,30 C38,31.1045695 37.1045695,32 36,32 L2,32 C0.8954305,32 1.3527075e-16,31.1045695 0,30 L0,2 C-1.3527075e-16,0.8954305 0.8954305,2.02906125e-16 2,0 Z"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          stroke="currentColor"
          fill="none"
          fillRule="evenodd"
        />
        <circle
          strokeWidth="3"
          strokeLinecap="round"
          cx="9.5"
          cy="8.5"
          r="1.5"
          strokeLinejoin="bevel"
          stroke="currentColor"
          fill="none"
          fillRule="evenodd"
        />
        <path
          d="M10,16 L15,20 L21,13 L38,26 L38,30 C38,31.1045695 37.1045695,32 36,32 L2,32 C0.8954305,32 2.27508946e-13,31.1045695 2.27373675e-13,30 L2.27373675e-13,26 L10,16 Z"
          strokeWidth="3"
          fill="none"
          fillRule="nonzero"
          strokeLinejoin="bevel"
          stroke="currentColor"
        />
      </g>
    </g>
  </svg>
);

export interface ImageButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  title?: {
    name?: string;
    shortcut?: string;
  };
  tipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  tipReverse?: boolean;
  children?: ReactNode;
  // shortcut 自定义
  keyCommand?: KeyCommand | false;
}

export interface ImageButtonExtraProps {
  // upload props
  uploadProps: UploadProps;
  languages?: Languages;
  // toolbar plugin 提供的 props
  getEditorState?: () => EditorState;
  setEditorState?: (editorState: EditorState) => void;
  getProps?: PluginMethods['getProps'];
  addKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  removeKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  addKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  removeKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  addBeforeInputHandler?: (
    beforeInputHandler: EditorPlugin['handleBeforeInput'],
  ) => void;
  removeBeforeInputHandler?: (
    beforeInputHandler: EditorPlugin['handleBeforeInput'],
  ) => void;
}

const ImageButton: React.FC<ImageButtonProps & ImageButtonExtraProps> = (
  props,
) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    title = {
      name: 'eeeditor.image.button.tip.name',
    },
    tipProps,
    tipReverse,
    children = defaultImageIcon,
    keyCommand,
    languages,
    uploadProps,
    getEditorState,
    setEditorState,
    getProps,
    addKeyCommandHandler,
    removeKeyCommandHandler,
    addKeyBindingFn,
    removeKeyBindingFn,
  } = props;

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale];
  }

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  const preventBubblingUp = (event: MouseEvent): void => {
    event.preventDefault();
  };

  useEffect(() => {
    if (keyCommand) {
      const keyBindingFn: EditorPlugin['keyBindingFn'] = (event) => {
        if (checkKeyCommand(keyCommand, event)) {
          return 'add-image';
        }
        return undefined;
      };

      const handleKeyCommand: EditorPlugin['handleKeyCommand'] = (
        command,
        editorState,
        { setEditorState },
      ) => {
        if (command === 'add-image') {
          if (
            !checkButtonShouldDisabled() &&
            editorState.getSelection().getHasFocus()
          ) {
            // todo
          }
          return 'handled';
        }
        return 'not-handled';
      };

      addKeyBindingFn(keyBindingFn);
      addKeyCommandHandler(handleKeyCommand);

      return () => {
        removeKeyBindingFn(keyBindingFn);
        removeKeyCommandHandler(handleKeyCommand);
      };
    }
  }, []);

  const checkButtonShouldDisabled = (): boolean => {
    if (!getEditorState) {
      return true;
    }
    const editorState: EditorState = getEditorState();
    const currentBlock: ContentBlock = editorState
      .getCurrentContent()
      .getBlockForKey(editorState.getSelection().getStartKey());
    const currentBlockType: DraftBlockType = currentBlock.getType();
    // 当 selection start block type 为 'atomic' 或者 'code-block' 时， disabled
    if (currentBlockType === 'atomic' || currentBlockType === 'code-block') {
      return true;
    }
    return false;
  };

  const btnClassName = classNames(`${prefixCls}-btn`, className, {
    [`${prefixCls}-btn-disabled`]: checkButtonShouldDisabled(),
  });

  const tipClassName = classNames(`${prefixCls}-tip`, {
    [`${prefixCls}-tip-reverse`]:
      tipReverse !== undefined
        ? tipReverse
        : tipProps && tipProps.placement.startsWith('top'),
  });

  const tipTitle: ReactNode =
    title && title.name ? (
      <span className={tipClassName}>
        <span className={`${prefixCls}-tip-name`}>
          {locale[title.name] || title.name}
        </span>
        {title.shortcut && (
          <span className={`${prefixCls}-tip-shortcut`}>
            {locale[title.shortcut] || title.shortcut}
          </span>
        )}
      </span>
    ) : (
      ''
    );

  return (
    <div className={`${prefixCls}-btn-wrapper`} onMouseDown={preventBubblingUp}>
      {checkButtonShouldDisabled() ? (
        <div className={btnClassName} style={style}>
          {children}
        </div>
      ) : (
        <Upload {...uploadProps}>
          <Tooltip
            title={tipTitle}
            overlayClassName={`${prefixCls}-tip-wrapper`}
            {...tipProps}
          >
            <div className={btnClassName} style={style}>
              {children}
            </div>
          </Tooltip>
        </Upload>
      )}
    </div>
  );
};

export default ImageButton;
