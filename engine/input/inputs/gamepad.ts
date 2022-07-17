import { BaseInput, IBaseInput } from './base-input';

export class Gamepad extends BaseInput {
	getState() {
		const gamepads = navigator.getGamepads();
		const state = gamepads
			.map((gamepad) => {
				if (gamepad) {
					return gamepad.buttons.map((button) => button.value);
				}
			})
			.filter((button) => button);
		return state;
	}
}

export interface IGamepad {}
