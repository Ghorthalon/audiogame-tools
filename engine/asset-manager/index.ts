import { Downloader } from './downloader';
import { Queue } from './queue';
import { Manifest } from './manifest';
import { AssetStorage } from './storage';
import { EventBus } from '../event-bus';
import { buildPath } from './utils';

export class AssetManager extends EventBus {
	private downloader: Downloader;
	private queue: Queue;
	private storage: AssetStorage;
	private manifest: any;
	public constructor(private name: string, private basePath: string) {
		super();
		this.queue = new Queue();
		this.storage = new AssetStorage(name);
		this.downloader = new Downloader(this.storage, this.queue, this.basePath);
		console.log(`Asset manager initialized`);
	}

	async init(): Promise<boolean> {
		await this.storage.init();
		return true;
	}

	async setManifest(path: string): Promise<any> {
		this.manifest = await Manifest(`${this.basePath}/${path}`);
		this.storage.setManifest(this.manifest);
		return this.manifest;
	}

	public enqueue(path: string): void {
		this.queue.add(path);
	}

	public async download(): Promise<any> {
		const result = await this.downloader.download();
		return result;
	}

	public async downloadFromManifest(key: string): Promise<any> {
		const paths: string[] = this.manifest[key];
		paths.forEach((path) => this.enqueue(path));
		this.downloader.subscribe('download.progress', (info) =>
			this.emit('progress', info)
		);
		const files = await this.downloader.download();
		this.downloader.unsubscribeAll('download.progress');
		return files;
	}

	public async downloadFile(path: string): Promise<any> {
		const result = await this.downloader.downloadItem(
			buildPath(this.basePath, path)
		);
		return result;
	}

	public setBasePath(path: string): void {
		this.basePath = path;
		this.downloader.setBasePath(this.basePath);
	}

	public clearCache(): void {
		this.storage.clear();
	}
}
