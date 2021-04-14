import UserAgent from 'fbjs/lib/UserAgent';

const isOSX: boolean = UserAgent.isPlatform('Mac OS X');

export default {
  'eeeditor.undo.tip.name': '撤销',
  'eeeditor.undo.tip.shortcut': isOSX ? '⌘ + z' : 'ctrl + z',
  'eeeditor.redo.tip.name': '重做',
  'eeeditor.redo.tip.shortcut': isOSX ? 'shift + ⌘ + z' : 'shift + ctrl + z',
};
