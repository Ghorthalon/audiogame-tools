export class BaseInput {
	protected active: boolean;
	public constructor(protected element: HTMLElement) {}

	public getState(): any {}

	public capture(preventDefault: boolean): void {
		return;
	}

	public release(): void {
		return;
	}
}

export interface IBaseInput {}
