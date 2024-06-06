// the main module for Resonator
// API, etc.

import { EventBus } from '../event-bus';
import ResonatorAudioContext from './audio-context';
import ResonatorScene from './scenes/webaudio-scene';
import AudioGraph from './audio-graph';
import AudioSource from './sources/audio-source';
import DataPool from './data-pool';
import DataPoolItem from './data-pool-item';
import Convolver from './effects/convolver';
import { BaseLoader } from './loaders/base-loader';
import { HTTPLoader } from './loaders/http-loader';
import { BaseSource } from './sources/base-source';
import { SourceType } from './sources/source-type';
import { StreamingSource } from './sources/streaming-source';
import BaseEffect from './effects/base-effect';

export default class Resonator {
	private context: ResonatorAudioContext;
	private scene: ResonatorScene;
	private graph: AudioGraph;
	private dataPool: DataPool;
	private environmentImpulse: BaseEffect = null;
	constructor(private loader: BaseLoader = new HTTPLoader()) {
		this.context = new ResonatorAudioContext();
		this.scene = new ResonatorScene(this.context);
		this.graph = new AudioGraph(this.scene, this.context, false);
		this.dataPool = new DataPool(this.context, this.loader);
	}

	async load(
		path: string,
		type: SourceType = SourceType.WorldSource
	): Promise<BaseSource> {
		const data: AudioBuffer = await this.dataPool.get(path);
		const source = this.createSource(type, data);
		return source;
	}

	loadImmediate(
		path: string,
		type: SourceType = SourceType.WorldSource
	): AudioSource {
		const source = new AudioSource(
			this.graph,
			this.scene,
			this.context,
			null,
			type
		);
		this.dataPool.get(path).then((data) => {
			source.setBuffer(data);
		});
		return source;
	}

	public stream(
		path: string,
		type: SourceType = SourceType.MasterSource
	): StreamingSource {
		const element = new Audio(path);
		element.crossOrigin = 'anonymous';
		element.volume = 1;
		const source = new StreamingSource(
			this.graph,
			this.scene,
			this.context,
			element,
			type
		);
		return source;
	}

	private createSource(type: SourceType, data: any): BaseSource {
		return new AudioSource(this.graph, this.scene, this.context, data);
	}

	async setEnvironmentImpulse(file: string, volume: number = 0.25) {
		if (file === null || file === '') {
			if (this.environmentImpulse) {
				this.graph.removeEffect(this.environmentImpulse);
				this.environmentImpulse = null;
			}
			return;
		}
		if (this.environmentImpulse && file !== '') {
			const buffer = await this.dataPool.get(file);
			(this.environmentImpulse as Convolver).setBuffer(buffer);
			(this.environmentImpulse as Convolver).setVolume(volume);
		}

		const buffer = await this.dataPool.get(file);
		this.environmentImpulse = new Convolver(this.context, this.graph, {
			buffer
		});
		(this.environmentImpulse as Convolver).setVolume(volume);
		this.graph.applyEffect(this.environmentImpulse);
	}

	setListenerPosition(x: number, y: number, z: number): void {
		this.scene.setListenerPosition(x, y, z);
	}

	setListenerOrientation(forward: any, up: any) {
		this.scene.setListenerOrientation(forward, up);
	}

	clearDataPool(): void {
		this.dataPool.clear();
	}
}
