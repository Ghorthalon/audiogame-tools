import { createInput } from './input-factory';
import { BaseInput } from './inputs/base-input';
import { State } from './interfaces/state';

export class Input {
	private inputs: Map<string, BaseInput>;
	public constructor(private InputIDs: string[], private element: HTMLElement) {
		this.inputs = new Map();
		this.init();
	}

	private init(): void {
		this.InputIDs.forEach((inputID) => {
			const thing = createInput(inputID);
			const instance = new thing(this.element);
			this.inputs.set(inputID, instance);
		});
	}

	public addInput(id: string, input: BaseInput): this {
		this.inputs.set(id, input);
		return this;
	}

	public capture(preventDefault: boolean = true) {
		this.inputs.forEach((input) => input.capture(preventDefault));
	}

	public release(): void {
		this.inputs.forEach((input) => input.release());
	}

	public getState(): State {
		const state: any = {};
		this.inputs.forEach((input, inputID) => {
			if (input) state[inputID] = input.getState();
		});
		return state;
	}
}
