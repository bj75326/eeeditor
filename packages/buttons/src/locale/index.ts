import zh_CN from './zh_CN';
import en_US from './en_US';
import { SupportedLanguage } from '@eeeditor/editor';

// export interface Locale {
//   'eeeditor.button.h1.tip.name'?: string;
//   'eeeditor.button.h1.tip.shortcut'?: string;
//   'eeeditor.button.h2.tip.name'?: string;
//   'eeeditor.button.h2.tip.shortcut'?: string;
//   'eeeditor.button.h3.tip.name'?: string;
//   'eeeditor.button.h3.tip.shortcut'?: string;
//   'eeeditor.button.h4.tip.name'?: string;
//   'eeeditor.button.h4.tip.shortcut'?: string;
//   'eeeditor.button.h5.tip.name'?: string;
//   'eeeditor.button.h5.tip.shortcut'?: string;
//   'eeeditor.button.h6.tip.name'?: string;
//   'eeeditor.button.h6.tip.shortcut'?: string;
//   'eeeditor.button.bold.tip.name'?: string;
//   'eeeditor.button.bold.tip.shortcut'?: string;
//   'eeeditor.button.underline.tip.name'?: string;
//   'eeeditor.button.underline.tip.shortcut'?: string;
//   'eeeditor.button.code.tip.name'?: string;
//   'eeeditor.button.code.tip.shortcut'?: string;
//   'eeeditor.button.italic.tip.name'?: string;
//   'eeeditor.button.italic.tip.shortcut'?: string;
//   'eeeditor.button.ol.tip.name'?: string;
//   'eeeditor.button.ol.tip.shortcut'?: string;
//   'eeeditor.button.ul.tip.name'?: string;
//   'eeeditor.button.ul.tip.shortcut'?: string;
//   'eeeditor.button.blockquote.tip.name'?: string;
//   'eeeditor.button.blockquote.tip.shortcut'?: string;
//   'eeeditor.button.align.center.tip.name'?: string;
//   'eeeditor.button.align.center.tip.shortcut'?: string;
//   'eeeditor.button.align.left.tip.name'?: string;
//   'eeeditor.button.align.left.tip.shortcut'?: string;
//   'eeeditor.button.align.right.tip.name'?: string;
//   'eeeditor.button.align.right.tip.shortcut'?: string;
//   'eeeditor.button.align.justify.tip.name'?: string;
//   'eeeditor.button.align.justify.tip.shortcut'?: string;
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
