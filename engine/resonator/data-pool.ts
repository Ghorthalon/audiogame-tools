// a data pool holds frequently played sounds in memory together with decoded audio data to no longer have to decode them from the cache when loaded again

import { EventBus } from '../event-bus';
import DataPoolItem from './data-pool-item';
import ResonatorAudioContext from './audio-context';
import { BaseLoader } from './loaders/base-loader';
import { HTTPLoader } from './loaders/http-loader';
export default class DataPool extends EventBus {
	private data: { [path: string]: DataPoolItem } = {};
	private maxData: number;
	private context: ResonatorAudioContext;
	constructor(
		context: ResonatorAudioContext,
		private loader: BaseLoader = new HTTPLoader(),
		maxData: number = 512
	) {
		super();
		this.maxData = maxData;
		this.context = context;
	}

	async get(path: string): Promise<AudioBuffer> {
		if (this.data[path]) {
			return this.data[path].getDecodedData();
		} else {
			const buffer = await this.loader.get(path);
			const decoded: AudioBuffer = await this.context.decodeAudioData(buffer);
			const item = new DataPoolItem(path, buffer, decoded);
			const length = Object.keys(this.data).length;
			if (length < this.maxData) {
				this.data[path] = item;
			} else {
				// TODO: figure out a more clever solution than just removing the first loaded data. Like tracking how much certain data is needed and prioritize them.
				// const paths: string[] = Object.keys(this.data);
				// delete this.data[paths[0]];
				this.data[path] = item;
			}
			return item.getDecodedData();
		}
	}

	public clear(): void {
		this.data = {};
	}
}
