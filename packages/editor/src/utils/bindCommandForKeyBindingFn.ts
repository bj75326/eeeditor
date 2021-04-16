import { DraftEditorCommand, KeyCommand, EditorPlugin } from '..';
import { KeyBindingUtil } from 'draft-js';

export const bindCommandForKeyBindingFn = (
  command: DraftEditorCommand | string,
): ((keyCommand: KeyCommand) => EditorPlugin['keyBindingFn']) => (
  keyCommand,
) => (event) => {
  if (
    keyCommand.keyCode === event.keyCode &&
    (keyCommand.isShiftKeyCommand === undefined ||
      keyCommand.isShiftKeyCommand === event.shiftKey) &&
    (keyCommand.isCtrlKeyCommand === undefined ||
      keyCommand.isCtrlKeyCommand === KeyBindingUtil.isCtrlKeyCommand(event)) &&
    (keyCommand.isOptionKeyCommand === undefined ||
      keyCommand.isOptionKeyCommand ===
        KeyBindingUtil.isOptionKeyCommand(event)) &&
    (keyCommand.hasCommandModifier === undefined ||
      keyCommand.hasCommandModifier ===
        KeyBindingUtil.hasCommandModifier(event))
  ) {
    return command;
  }
  return undefined;
};
