import { CheckManifest } from './manifest';

export class AssetStorage {
	private cache: Cache;
	private manifest: any;
	public constructor(private id: string) {}

	async init() {
		this.cache = await caches.open(this.id);
	}

	async add(request: RequestInfo, response: Response): Promise<Boolean> {
		const result = await this.cache.put(request, response);
		return true;
	}

	async get(request: RequestInfo): Promise<Response> {
		const result = await this.cache.match(request);
		return result;
	}

	async setManifest(manifest: any) {
		this.manifest = manifest;
		if (!CheckManifest(this.manifest)) {
			await this.clear();
		}
	}

	async clear(): Promise<void> {
		const keys = await this.cache.keys();
		keys.forEach(async (key) => {
			const result = await this.cache.delete(key);
		});
	}
}
