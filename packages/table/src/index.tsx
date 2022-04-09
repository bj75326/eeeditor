import React, {} from 'react';
import { EditorPlugin, PluginMethods } from '@eeeditor/editor';
import { Store, createStore } from '@draft-js-plugins/utils';
import { Map } from 'immutable';

interface TablePluginConfig {

}

export interface StoreItemMap {
  pluginMethod?: PluginMethods;
}

export type TablePluginStore = Store<StoreItemMap>;

const createTablePlugin = ({

}: TablePluginConfig): EditorPlugin => {
  const store = createStore<StoreItemMap>({

  });
  
  return {
    initialize (pluginMethods: PluginMethods) {
      store.updateItem('pluginMethod', pluginMethods);  
    },
    
    blockRenderMap: Map({
      'table-cell': {
        element: "div",
        // wrapper: 
      }
    }),
  };
};

export default createTablePlugin;
