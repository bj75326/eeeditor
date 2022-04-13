import React, { ComponentType } from 'react';
import { EditorPlugin, PluginMethods } from '@eeeditor/editor';
import { Store, createStore } from '@draft-js-plugins/utils';
import { Map } from 'immutable';
import TableWrapper from './components/TableWrapper';
import DefaultTableButton, {
  TableButtonProps,
  TableButtonExtraProps,
} from './components/TableButton';
import lang, { Languages } from './locale';

export * from './locale';

interface TablePluginConfig {
  prefixCls?: string;
  tableButtonComponent?: ComponentType<
    TableButtonProps & TableButtonExtraProps
  >;
  languages?: Languages;
}

export interface StoreItemMap {
  pluginMethod?: PluginMethods;
}

export type TablePluginStore = Store<StoreItemMap>;

const createTablePlugin = ({
  prefixCls,
  tableButtonComponent: TableButtonComponent = DefaultTableButton,
  languages = lang,
}: TablePluginConfig): EditorPlugin & {
  TableButton: ComponentType<TableButtonProps>;
} => {
  const store = createStore<StoreItemMap>({});

  const TableButton: React.FC<TableButtonProps> = (props) => (
    <TableButtonComponent {...props} languages={languages} />
  );

  return {
    initialize(pluginMethods: PluginMethods) {
      store.updateItem('pluginMethod', pluginMethods);
    },

    blockRenderMap: Map({
      'table-cell': {
        element: 'div',
        wrapper: TableWrapper,
      },
    }),

    TableButton,
  };
};

export default createTablePlugin;
