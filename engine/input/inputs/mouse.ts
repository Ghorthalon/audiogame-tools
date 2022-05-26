import { BaseInput } from './base-input';

export class Mouse extends BaseInput {
	private mousePosition: Position = new Position();
	private mouseDelta: Delta = new Delta();
	private mouseWheel: Delta = new Delta();
	private mouseButtons: MouseButtons = new MouseButtons();
	public constructor(element: HTMLElement) {
		super(element);
	}

	public capture(): void {
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handlePointerChange = this.handlePointerChange.bind(this);
		this.active = true;
		this.element.addEventListener('mousedown', this.handleMouseDown);
		this.element.addEventListener('mousemove', this.handleMouseMove);
		this.element.addEventListener('mouseup', this.handleMouseUp);
		document.addEventListener('pointerlockchange', this.handlePointerChange);
	}

	public release(): void {
		this.active = false;
		this.element.removeEventListener('mousedown', this.handleMouseDown);
		this.element.removeEventListener('mousemove', this.handleMouseMove);
		this.element.removeEventListener('mouseup', this.handleMouseUp);
	}

	public getState(): IMouse {
		const { mouseButtons, mouseDelta, mousePosition, mouseWheel } = this;
		const state = {
			mouseButtons: {
				keysDown: new Map<number, boolean>(this.mouseButtons.keysDown),
				keysJustPressed: new Map<number, boolean>(
					this.mouseButtons.keysJustPressed
				),
				keysJustReleased: new Map<number, boolean>(
					this.mouseButtons.keysJustReleased
				)
			},
			mouseDelta,
			mousePosition,
			mouseWheel
		};
		this.mouseButtons.keysJustPressed.clear();
		this.mouseButtons.keysJustReleased.clear();
		this.mouseDelta.x = 0;
		this.mouseDelta.y = 0;
		return state;
	}

	private handleMouseDown(event: MouseEvent): void {
		if (this.active) event.preventDefault();
		this.mouseButtons.keysDown.set(event.button, true);
		this.mouseButtons.keysJustPressed.set(event.button, true);
		this.mouseButtons.keysJustReleased.set(event.button, false);
	}
	private handleMouseMove(event: MouseEvent): void {
		if (this.active) event.preventDefault();
		this.mousePosition.x = event.clientX;
		this.mousePosition.y = event.clientY;
		this.mouseDelta.x = event.movementX;
		this.mouseDelta.y = event.movementY;
	}
	private handleMouseUp(event: MouseEvent): void {
		if (this.active) event.preventDefault();
		this.mouseButtons.keysJustReleased.set(event.button, true);
		this.mouseButtons.keysDown.set(event.button, false);
		this.mouseButtons.keysJustPressed.set(event.button, false);
	}

	private handlePointerChange(): void {
		if (document.pointerLockElement !== this.element) {
			this.element.addEventListener(
				'click',
				() => {
					this.element.requestPointerLock();
				},
				{
					once: true
				}
			);
		}
	}
}

export class Position {
	x: number;
	y: number;
}

export class MouseButtons {
	keysDown: Map<number, boolean> = new Map();
	keysJustPressed: Map<number, boolean> = new Map();
	keysJustReleased: Map<number, boolean> = new Map();
}

export class Delta {
	x: number;
	y: number;
}

export interface IMouse {
	mouseButtons: MouseButtons;
	mousePosition: Position;
	mouseWheel: Delta;
	mouseDelta: Delta;
}
