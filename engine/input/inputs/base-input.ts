export enum InputType {
	Keyboard = 'keyboard',
	Mouse = 'mouse'
}

export abstract class BaseInput {
	protected active: boolean;
	public constructor(protected element: HTMLElement) {}

	abstract getState(): any;

	public capture(preventDefault: boolean): void {
		return;
	}

	public release(): void {
		return;
	}
}

export interface IBaseInput {}
