import zh_CN from './zh_CN';
import en_US from './en_US';
import { SupportedLanguage } from '@eeeditor/editor';

// export interface Locale {
//   'eeeditor.anchor.button.tip.name'?: string;
//   'eeeditor.anchor.button.tip.shortcut'?: string;
//   'eeeditor.anchor.edit.button.tip'?: string;
//   'eeeditor.anchor.copy.button.tip'?: string;
//   'eeeditor.anchor.delete.button.tip'?: string;
// }

export type Locale = Record<string, string>;

export const zhCN: Locale = zh_CN;
export const enUS: Locale = en_US;

export type Languages = Record<SupportedLanguage, Locale>;

const languages: Languages = {
  zh_CN: zhCN,
  en_US: enUS,
};

export default languages;
