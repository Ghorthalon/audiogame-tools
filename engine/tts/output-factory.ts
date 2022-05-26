import { BaseOutput } from './outputs/base-output';
import { AriaOutput } from './outputs/aria';
import { WebTTSOutput } from './outputs/webtts';

export function createOutput(key: string = 'aria'): any {
	switch (key) {
		case 'aria':
			return AriaOutput;
			break;
		case 'webtts':
			return WebTTSOutput;
			break;
		default:
			return AriaOutput;
			break;
	}
}

export { WebTTSOutput, AriaOutput, BaseOutput };
