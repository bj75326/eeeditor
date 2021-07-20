import UserAgent from 'fbjs/lib/UserAgent';

const isOSX = UserAgent.isPlatform('Mac OS X');

export default {
  'eeeditor.button.h1.tip.name': 'Heading 1',
  'eeeditor.button.h1.tip.shortcut': '# space',
  'eeeditor.button.h2.tip.name': 'Heading 2',
  'eeeditor.button.h2.tip.shortcut': '## space',
  'eeeditor.button.h3.tip.name': 'Heading 3',
  'eeeditor.button.h3.tip.shortcut': '### space',
  'eeeditor.button.h4.tip.name': 'Heading 4',
  'eeeditor.button.h4.tip.shortcut': '#### space',
  'eeeditor.button.h5.tip.name': 'Heading 5',
  'eeeditor.button.h5.tip.shortcut': '##### sapce',
  'eeeditor.button.h6.tip.name': 'Heading 6',
  'eeeditor.button.h6.tip.shortcut': '###### space',
  'eeeditor.button.bold.tip.name': 'Bold',
  'eeeditor.button.bold.tip.shortcut': isOSX ? '⌘ + b' : 'ctrl + b',
  'eeeditor.button.underline.tip.name': 'Underline',
  'eeeditor.button.underline.tip.shortcut': isOSX ? '⌘ + u' : 'ctrl + u',
  'eeeditor.button.code.tip.name': 'Code',
  'eeeditor.button.italic.tip.name': 'Italic',
  'eeeditor.button.italic.tip.shortcut': isOSX ? '⌘ + i' : 'ctrl + i',
  'eeeditor.button.ol.tip.name': 'Ordered list',
  'eeeditor.button.ol.tip.shortcut': '1. space',
  'eeeditor.button.ul.tip.name': 'Unordered list',
  'eeeditor.button.ul.tip.shortcut': '- space',
  'eeeditor.button.blockquote.tip.name': 'Blockquote',
  'eeeditor.button.blockquote.tip.shortcut': '> space',
  'eeeditor.button.align.center.tip.name': 'Center align',
  'eeeditor.button.align.center.tip.shortcut': isOSX ? '⌘ + e' : 'ctrl + e',
  'eeeditor.button.align.left.tip.name': 'Left align',
  'eeeditor.button.align.left.tip.shortcut': isOSX ? '⌘ + l' : 'ctrl + l',
  'eeeditor.button.align.right.tip.name': 'Right align',
  'eeeditor.button.align.right.tip.shortcut': isOSX ? '⌘ + r' : 'ctrl + r',
  'eeeditor.button.align.justify.tip.name': 'Justify',
  'eeeditor.button.align.justify.tip.shortcut': isOSX ? '⌘ + j' : 'ctrl + j',
  'eeeditor.button.strikethrough.tip.name': 'Strike through',
  'eeeditor.button.strikethrough.tip.shortcut': isOSX
    ? '⌘ + shift + s'
    : 'ctrl + shift + s',
};
