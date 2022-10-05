import { BaseOutput } from './base-output';

export class WebTTSOutput extends BaseOutput {
	private synth: Window['speechSynthesis'];
	private rate: number;

	public constructor(options: any = {}) {
		super();
		this.rate = options.rate || 1;
		this.synth = window.speechSynthesis;
	}

	public speak(text: string): void {
		let utterThis = new SpeechSynthesisUtterance(text);
		utterThis.rate = this.rate;
		this.synth.speak(utterThis);
	}

	public stop(): void {
		this.synth.cancel();
	}

	public setOptions(options: any): void {
		this.rate = options.rate || 1;
	}
}
