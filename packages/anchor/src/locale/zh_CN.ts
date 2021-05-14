import UserAgent from 'fbjs/lib/UserAgent';

const isOSX: boolean = UserAgent.isPlatform('Mac OS X');

export default {
  'eeeditor.anchor.button.tip.name': '插入链接',
  'eeeditor.anchor.button.tip.shortcut': isOSX ? '⌘ + k' : 'ctrl + k',
};
