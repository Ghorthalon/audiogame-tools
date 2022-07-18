import { BaseInput, InputType } from './inputs/base-input';
import { Keyboard } from './inputs/keyboard';
import { Mouse } from './inputs/mouse';
import { Gamepad } from './inputs/gamepad';

export function createInput(key: string): any {
	switch (key) {
		case InputType.Keyboard:
			return Keyboard;
			break;
		case InputType.Mouse:
			return Mouse;
			break;
		case InputType.Gamepad:
			return Gamepad;
			break;
		default:
			throw new Error(`Unknown input type: ${key}`);
	}
}
