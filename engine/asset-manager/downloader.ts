import { EventBus } from '../event-bus';
import { Queue } from './queue';
import { AssetStorage } from './storage';
import { buildPath } from './utils';

export class Downloader extends EventBus {
	public constructor(
		private storage: AssetStorage,
		private queue: Queue,
		private basePath: string = ''
	) {
		super();
	}

	public setBasePath(path: string): void {
		this.basePath = this.basePath;
	}

	async download(): Promise<any> {
		const downloaded: Map<string, any> = new Map();
		let numDownloaded = 0;
		while (this.queue.length() > 0) {
			const path = this.queue.pop();
			const item = await this.downloadItem(buildPath(this.basePath, path));
			downloaded.set(path, item);
			numDownloaded++;
			this.emit('download.progress', {
				downloaded: numDownloaded,
				remaining: this.queue.length()
			});
		}
		return downloaded;
	}

	async downloadItem(path: string): Promise<any> {
		const inCache = await this.storage.get(path);
		if (inCache) {
			return inCache;
		}
		const response = await fetch(path);
		this.storage.add(path, response);
		return response;
	}
}
