import { KeyboardEvent } from 'react';
import { EditorPlugin, DraftEditorCommand } from '../..';
import { KeyBindingUtil, RichUtils } from 'draft-js';
import UserAgent from 'fbjs/lib/UserAgent';
import Keys from 'fbjs/lib/Keys';

const isOSX = UserAgent.isPlatform('Mac OS X');
const isWindows = UserAgent.isPlatform('Windows');

const shouldFixFirefoxMovement = isOSX && UserAgent.isBrowser('Firefox < 29');
const { hasCommandModifier, isCtrlKeyCommand } = KeyBindingUtil;

const shouldRemoveWord = (e: KeyboardEvent): boolean =>
  (isOSX && e.altKey) || isCtrlKeyCommand(e);

// const getZCommand = (e: KeyboardEvent): DraftEditorCommand | null => {
//   if (!hasCommandModifier(e)) {
//     return null;
//   }
//   return e.shiftKey ? 'redo' : 'undo';
// }

const getDeleteCommand = (e: KeyboardEvent): DraftEditorCommand | null => {
  // Allow default "cut" behavior for Windows on Shift + Delete.
  if (isWindows && e.shiftKey) {
    return null;
  }
  return shouldRemoveWord(e) ? 'delete-word' : 'delete';
};

const getBackspaceCommand = (e: KeyboardEvent): DraftEditorCommand | null => {
  if (hasCommandModifier(e) && isOSX) {
    return 'backspace-to-start-of-line';
  }
  return shouldRemoveWord(e) ? 'backspace-word' : 'backspace';
};

export default (): EditorPlugin => ({
  keyBindingFn: (e: KeyboardEvent): DraftEditorCommand | null => {
    console.log('default keyBindingFn');
    switch (e.keyCode) {
      // bold command 会在 @eeeditor/buttons BoldButton 中设置
      // case 66: // B
      //   return hasCommandModifier(e) ? 'bold' : null;
      // delete command 不会在 eeeditor plugins 中被设置，所以保留默认返回值
      case 68: // D
        return isCtrlKeyCommand(e) ? 'delete' : null;
      // backspace command 不会在 eeeditor plugins 中被设置，所以保留默认返回值
      case 72: // H
        return isCtrlKeyCommand(e) ? 'backspace' : null;
      // italic command 会在 @eeeditor/buttons ItalicButton 中设置
      // case 73: // I
      //   return hasCommandModifier(e) ? 'italic' : null;
      // code command 会在 @eeeditor/buttons CodeButton 中设置
      // case 74: // J
      //   return hasCommandModifier(e) ? 'code' : null;
      case 75: // K
        return !isWindows && isCtrlKeyCommand(e) ? 'secondary-cut' : null;
      case 77: // M
        return isCtrlKeyCommand(e) ? 'split-block' : null;
      case 79: // O
        return isCtrlKeyCommand(e) ? 'split-block' : null;
      case 84: // T
        return isOSX && isCtrlKeyCommand(e) ? 'transpose-characters' : null;
      // underline command 会在 @eeeditor/buttons UnderlineButton 中设置
      // case 85: // U
      //   return hasCommandModifier(e) ? 'underline' : null;
      case 87: // W
        return isOSX && isCtrlKeyCommand(e) ? 'backspace-word' : null;
      case 89: // Y
        if (isCtrlKeyCommand(e)) {
          return isWindows ? 'redo' : 'secondary-paste';
        }
        return null;
      // undo&redo command 会在 @eeeditor/undo UndoButton RedoButton 中设置
      // case 90: // Z
      //   return getZCommand(e) || null;
      case Keys.RETURN:
        return 'split-block';
      case Keys.DELETE:
        return getDeleteCommand(e);
      case Keys.BACKSPACE:
        return getBackspaceCommand(e);
      // LEFT/RIGHT handlers serve as a workaround for a Firefox bug.
      case Keys.LEFT:
        return shouldFixFirefoxMovement && hasCommandModifier(e)
          ? 'move-selection-to-start-of-block'
          : null;
      case Keys.RIGHT:
        return shouldFixFirefoxMovement && hasCommandModifier(e)
          ? 'move-selection-to-end-of-block'
          : null;
      default:
        return null;
    }
  },
});
