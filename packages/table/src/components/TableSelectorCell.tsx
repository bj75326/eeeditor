import React, { useContext } from 'react';
import classNames from 'classnames';
import { EEEditorContext } from '@eeeditor/editor';

export interface TableSelectorCellProps {
  prefixCls?: string;
  row: number;
  column: number;
  currRow: number;
  currColumn: number;
  changeRow: (row: number) => void;
  changeColumn: (column: number) => void;
}

const TableSelectorCell: React.FC<TableSelectorCellProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    row,
    column,
    currRow,
    currColumn,
    changeRow,
    changeColumn,
  } = props;

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  const handleMouseEnter = () => {
    changeRow(row);
    changeColumn(column);
  };

  const cellCls = classNames(`${prefixCls}-table-selector-cell`, {
    [`${prefixCls}-table-selector-cell-selected`]:
      row <= currRow && column <= currColumn,
  });

  return <div className={cellCls} onMouseEnter={handleMouseEnter} />;
};

export default TableSelectorCell;
