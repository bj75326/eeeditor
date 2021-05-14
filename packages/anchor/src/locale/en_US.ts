import UserAgent from 'fbjs/lib/UserAgent';

const isOSX: boolean = UserAgent.isPlatform('Mac OS X');

export default {
  'eeeditor.anchor.button.tip.name': 'Insert link',
  'eeeditor.anchor.button.tip.shortcut': isOSX ? '⌘ + k' : 'ctrl + k',
};
