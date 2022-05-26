import { BaseInput, IBaseInput } from './base-input';

export class Keyboard extends BaseInput {
	private keysDown: Map<number, boolean>;
	private keysJustPressed: Map<number, boolean>;
	private keysJustReleased: Map<number, boolean>;
	private preventDefault: boolean;
	public constructor(element: HTMLElement) {
		super(element);
		this.keysDown = new Map();
		this.keysJustPressed = new Map();
		this.keysJustReleased = new Map();
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	public capture(preventDefault: boolean): void {
		this.active = true;
		this.preventDefault = preventDefault;
		this.element.addEventListener('keydown', this.handleKeyDown);
		this.element.addEventListener('keyup', this.handleKeyUp);
	}

	public release(): void {
		this.active = false;
		this.element.removeEventListener('keydown', this.handleKeyDown);
		this.element.removeEventListener('keyup', this.handleKeyUp);
	}

	public getState(): IKeyboard {
		const state: IKeyboard = {
			keysDown: new Map<number, boolean>(this.keysDown),
			keysJustPressed: new Map<number, boolean>(this.keysJustPressed),
			keysJustReleased: new Map<number, boolean>(this.keysJustReleased)
		};
		this.keysJustPressed.clear();
		this.keysJustReleased.clear();
		return state;
	}

	private handleKeyDown(event: KeyboardEvent) {
		if (this.active && this.preventDefault) event.preventDefault();
		if (this.keysDown.get(event.keyCode)) return;
		this.keysDown.set(event.keyCode, true);
		this.keysJustPressed.set(event.keyCode, true);
		this.keysJustReleased.set(event.keyCode, false);
	}

	private handleKeyUp(event: KeyboardEvent) {
		if (this.active && this.preventDefault) event.preventDefault();
		if (!this.keysDown.get(event.keyCode)) return;
		this.keysDown.set(event.keyCode, false);
		this.keysJustPressed.set(event.keyCode, false);
		this.keysJustReleased.set(event.keyCode, true);
	}
}

export interface IKeyboard {
	keysDown: Map<number, boolean>;
	keysJustPressed: Map<number, boolean>;
	keysJustReleased: Map<number, boolean>;
}
