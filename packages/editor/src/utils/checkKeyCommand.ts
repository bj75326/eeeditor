import { KeyboardEvent } from 'react';
import { KeyCommand } from '..';
import { KeyBindingUtil } from 'draft-js';

export const checkKeyCommand = (
  keyCommand: KeyCommand,
  event: KeyboardEvent,
): boolean =>
  keyCommand.keyCode === event.keyCode &&
  (keyCommand.isShiftKeyCommand === undefined ||
    keyCommand.isShiftKeyCommand === event.shiftKey) &&
  (keyCommand.isCtrlKeyCommand === undefined ||
    keyCommand.isCtrlKeyCommand === KeyBindingUtil.isCtrlKeyCommand(event)) &&
  (keyCommand.isOptionKeyCommand === undefined ||
    keyCommand.isOptionKeyCommand ===
      KeyBindingUtil.isOptionKeyCommand(event)) &&
  (keyCommand.hasCommandModifier === undefined ||
    keyCommand.hasCommandModifier === KeyBindingUtil.hasCommandModifier(event));

export default checkKeyCommand;
