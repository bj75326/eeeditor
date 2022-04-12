import React, {
  CSSProperties,
  ReactNode,
  useContext,
  MouseEvent,
  useState,
  useEffect,
} from 'react';
import {
  KeyCommand,
  EditorState,
  PluginMethods,
  EditorPlugin,
  EEEditorContext,
  ContentBlock,
  DraftBlockType,
  checkKeyCommand,
} from '@eeeditor/editor';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import { Tooltip, Popover } from 'antd';
import { Languages, zhCN, Locale } from '..';
import classNames from 'classnames';
import TableSelectorCell from './TableSelectorCell';

export const defaultTableIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M39.3 6H8.7C7.20883 6 6 7.20883 6 8.7V39.3C6 40.7912 7.20883 42 8.7 42H39.3C40.7912 42 42 40.7912 42 39.3V8.7C42 7.20883 40.7912 6 39.3 6Z"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      d="M18 6V42"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M30 6V42"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M6 18H42"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M6 30H42"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

type PopoverPlacement = 'top' | 'bottom';

export interface TableButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  title?: {
    name?: string;
    shortcut?: string;
  };
  tipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  tipReverse?: boolean;
  popoverPlacement?: PopoverPlacement;
  children?: ReactNode;
  // shortcut 自定义
  keyCommand?: KeyCommand | false;
}

export interface TableButtonExtraProps {
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

const TableButton: React.FC<TableButtonProps & TableButtonExtraProps> = (
  props,
) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    title = {
      name: 'eeeditor.table.button.tip.name',
    },
    tipProps,
    tipReverse,
    popoverPlacement = 'bottomLeft',
    children = defaultTableIcon,
    keyCommand,
    languages,
    getEditorState,
    setEditorState,
    getProps,
    addKeyCommandHandler,
    removeKeyCommandHandler,
    addKeyBindingFn,
    removeKeyBindingFn,
  } = props;

  const [row, setRow] = useState<number>(1);
  const [column, setColumn] = useState<number>(1);

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  const preventDefault = (event: MouseEvent): void => {
    event.preventDefault();
  };

  useEffect(() => {
    if (keyCommand) {
      const keyBindingFn: EditorPlugin['keyBindingFn'] = (event) => {
        if (checkKeyCommand(keyCommand, event)) {
          return 'add-table';
        }
        return undefined;
      };

      const handleKeyCommand: EditorPlugin['handleKeyCommand'] = (
        command,
        editorState,
        { setEditorState },
      ) => {
        if (command === 'add-table') {
          if (
            !checkButtonShouldDisabled() &&
            editorState.getSelection().getHasFocus()
          ) {
            // const newEditorState = addDivider(editorState);
            // setEditorState(newEditorState);
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
    if (
      currentBlockType === 'atomic' ||
      currentBlockType === 'code-block' ||
      currentBlockType === 'table-cell'
    ) {
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

  const getRow = (): number => {
    if (row < 4) {
      return 4;
    } else if (row >= 4 && row < 7) {
      return row + 1;
    } else if (row >= 7) {
      return 8;
    }
  };

  const getColumn = (): number => {
    if (column < 4) {
      return 4;
    } else if (column >= 4 && column < 7) {
      return column + 1;
    } else if (column >= 7) {
      return 8;
    }
  };

  const updateRow = (row: number) => {
    setRow(row);
  };

  const updateColumn = (column: number) => {
    setColumn(column);
  };

  const popoverContent = (
    <div className={`${prefixCls}-table-selector`}>
      {Array(getRow()).map((_, rowIndex) => (
        <div className={`${prefixCls}-table-selector-row`} key={rowIndex}>
          {Array(getColumn()).map((_, columnIndex) => (
            <TableSelectorCell
              row={rowIndex + 1}
              column={columnIndex + 1}
              currRow={row}
              currColumn={column}
              changeRow={updateRow}
              changeColumn={updateColumn}
              key={columnIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`${prefixCls}-btn-wrapper`} onMouseDown={preventDefault}>
      {checkButtonShouldDisabled() ? (
        <div className={btnClassName} style={style}>
          {children}
        </div>
      ) : (
        <Popover
          content={popoverContent}
          placement={popoverPlacement}
          trigger="click"
        >
          <Tooltip
            title={tipTitle}
            overlayClassName={`${prefixCls}-tip-wrapper`}
            {...tipProps}
          >
            <div className={btnClassName} style={style}>
              {children}
            </div>
          </Tooltip>
        </Popover>
      )}
    </div>
  );
};

export default TableButton;
