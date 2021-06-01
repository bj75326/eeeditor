import UserAgent from 'fbjs/lib/UserAgent';

const isOSX: boolean = UserAgent.isPlatform('Mac OS X');

export default {
  'eeeditor.anchor.button.tip.name': '插入链接',
  'eeeditor.anchor.button.tip.shortcut': isOSX ? '⌘ + k' : 'ctrl + k',
  'eeeditor.anchor.edit.button.tip': '编辑链接',
  'eeeditor.anchor.copy.button.tip': '拷贝链接',
  'eeeditor.anchor.delete.button.tip': '删除链接',
  'eeeditor.anchor.edit.text.label': '文本',
  'eeeditor.anchor.edit.link.label': '链接',
};
