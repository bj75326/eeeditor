import UserAgent from 'fbjs/lib/UserAgent';

const isOSX: boolean = UserAgent.isPlatform('Mac OS X');

export default {
  'eeeditor.anchor.button.tip.name': 'Insert link',
  'eeeditor.anchor.button.tip.shortcut': isOSX ? '⌘ + k' : 'ctrl + k',
  'eeeditor.anchor.edit.button.tip': 'Edit link',
  'eeeditor.anchor.copy.button.tip': 'Copy link',
  'eeeditor.anchor.delete.button.tip': 'Delete link',
  'eeeditor.anchor.edit.text.label': 'Text',
  'eeeditor.anchor.edit.link.label': 'Link',
  'eeeditor.anchor.edit.link.placeholder': 'Press the Enter key to confirm',
  'eeeditor.anchor.edit.text.placeholder':
    'Will use link url if no text provided',
  'eeeditor.anchor.copy.success.msg': 'Link copyed',
  'eeeditor.anchor.copy.error.msg': 'Link copy failed',
};
