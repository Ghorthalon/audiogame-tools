import { BaseInput, IBaseInput } from './base-input';

export class Joystick extends BaseInput {
	public constructor(element: HTMLElement) {
		super(element);
	}
}

export interface IJoystick {}
