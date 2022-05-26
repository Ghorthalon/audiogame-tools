import { BaseLoader } from './base-loader';

export class HTTPLoader implements BaseLoader {
	public async get(path: string): Promise<ArrayBuffer> {
		const result = await fetch(path);
		const buffer = await result.arrayBuffer();
		return buffer;
	}
}
