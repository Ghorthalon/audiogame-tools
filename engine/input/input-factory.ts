import { BaseInput, InputType } from './inputs/base-input';
import { Keyboard } from './inputs/keyboard';
import { Mouse } from './inputs/mouse';

export function createInput(key: string): any {
	switch (key) {
		case InputType.Keyboard:
			return Keyboard;
			break;
		case InputType.Mouse:
			return Mouse;
			break;
		default:
			throw new Error(`Unknown input type: ${key}`);
	}
}
