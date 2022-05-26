// TODO fix path when actually properly linking the packages together
import { AssetManager } from '../../asset-manager';
import { BaseLoader } from './base-loader';

export class AssetLoader implements BaseLoader {
	private assetManager: AssetManager;
	public constructor(
		private name: string,
		private manager: AssetManager = null
	) {
		if (manager) {
			this.assetManager = manager;
		} else {
			this.assetManager = new AssetManager(name, '');
		}
	}

	async init() {
		await this.assetManager.init();
	}

	public async get(path: string): Promise<ArrayBuffer> {
		const result = await this.assetManager.downloadFile(path);
		console.log(result);
		const buffer = await result.arrayBuffer();
		return buffer;
	}
}
