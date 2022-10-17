import { BaseOutput } from './outputs/base-output';
import { AriaOutput } from './outputs/aria';
import { WebTTSOutput } from './outputs/webtts';

export function createOutput(key: string = 'aria'): any {
	switch (key) {
		case 'aria':
			return new AriaOutput();
			break;
		case 'webtts':
			return new WebTTSOutput();
			break;
		default:
			return new AriaOutput();
			break;
	}
}

export { WebTTSOutput, AriaOutput, BaseOutput };
