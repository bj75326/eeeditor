import UserAgent from 'fbjs/lib/UserAgent';

const isOSX: boolean = UserAgent.isPlatform('Mac OS X');

export default {
  'eeeditor.button.h1.tip.name': '一级标题',
  'eeeditor.button.h1.tip.shortcut': '# 空格',
  'eeeditor.button.h2.tip.name': '二级标题',
  'eeeditor.button.h2.tip.shortcut': '## 空格',
  'eeeditor.button.h3.tip.name': '三级标题',
  'eeeditor.button.h3.tip.shortcut': '### 空格',
  'eeeditor.button.h4.tip.name': '四级标题',
  'eeeditor.button.h4.tip.shortcut': '#### 空格',
  'eeeditor.button.h5.tip.name': '五级标题',
  'eeeditor.button.h5.tip.shortcut': '##### 空格',
  'eeeditor.button.h6.tip.name': '六级标题',
  'eeeditor.button.h6.tip.shortcut': '###### 空格',
  'eeeditor.button.bold.tip.name': '加粗',
  'eeeditor.button.bold.tip.shortcut': isOSX ? '⌘ + b' : 'ctrl + b',
  'eeeditor.button.underline.tip.name': '下划线',
  'eeeditor.button.underline.tip.shortcut': isOSX ? '⌘ + u' : 'ctrl + u',
  'eeeditor.button.code.tip.name': '行内代码',
  'eeeditor.button.italic.tip.name': '斜体',
  'eeeditor.button.italic.tip.shortcut': isOSX ? '⌘ + i' : 'ctrl + i',
  'eeeditor.button.ol.tip.name': '有序列表',
  'eeeditor.button.ol.tip.shortcut': '1. 空格',
  'eeeditor.button.ul.tip.name': '无序列表',
  'eeeditor.button.ul.tip.shortcut': '- 空格',
  'eeeditor.button.blockquote.tip.name': '引用',
  'eeeditor.button.blockquote.tip.shortcut': '> 空格',
  'eeeditor.button.align.center.tip.name': '居中对齐',
  'eeeditor.button.align.center.tip.shortcut': isOSX ? '⌘ + e' : 'ctrl + e',
  'eeeditor.button.align.left.tip.name': '左对齐',
  'eeeditor.button.align.left.tip.shortcut': isOSX ? '⌘ + l' : 'ctrl + l',
  'eeeditor.button.align.right.tip.name': '右对齐',
  'eeeditor.button.align.right.tip.shortcut': isOSX ? '⌘ + r' : 'ctrl + r',
  'eeeditor.button.align.justify.tip.name': '两端对齐',
  'eeeditor.button.align.justify.tip.shortcut': isOSX ? '⌘ + j' : 'ctrl + j',
  'eeeditor.button.strikethrough.tip.name': '中划线',
  'eeeditor.button.strikethrough.tip.shortcut': isOSX
    ? '⌘ + shift + s'
    : 'ctrl + shift + s',
};
