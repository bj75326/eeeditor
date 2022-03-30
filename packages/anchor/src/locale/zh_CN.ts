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
  'eeeditor.anchor.edit.link.placeholder': '输入链接，回车确定',
  'eeeditor.anchor.edit.text.placeholder': '文本为空则显示为链接值',
  'eeeditor.anchor.copy.success.msg': '链接拷贝成功',
  'eeeditor.anchor.copy.error.msg': '链接拷贝失败',
};
