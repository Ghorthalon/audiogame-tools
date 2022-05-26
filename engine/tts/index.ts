import { BaseOutput } from './outputs/base-output';
import { createOutput } from './output-factory';

export class TTS {
	public constructor(private output: BaseOutput = createOutput()) {}

	public speak(text: string): void {
		this.output.speak(text);
	}

	public stop(): void {
		this.output.stop();
	}
}
