import React from 'react';

export interface Locale {
  //todo
}

export type DirectionType = 'ltr' | 'rtl' | undefined;

export interface EEEditorConsumerProps {
  rootPrefixCls?: string;
  getPrefixCls?: (suffixCls?: string, customizePrefixCls?: string) => string;
  locale?: Locale;
  direction?: DirectionType;
}

export const EEEditorContext = React.createContext<EEEditorConsumerProps>({
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) {
      return customizePrefixCls;
    }
    return suffixCls ? `eee-${suffixCls}` : 'eee';
  },
});
