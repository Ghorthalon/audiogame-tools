import { Keyboard } from './inputs/keyboard';
import { Mouse } from './inputs/mouse';
import { BaseInput } from './inputs/base-input';

export function createInput(key: string): any {
	switch (key) {
		case 'keyboard':
			return Keyboard;
			break;
		case 'mouse':
			return Mouse;
			break;
		default:
			break;
	}
}
