import { BaseSource } from './base-source';
import AudioGraph from '../audio-graph';
import ResonatorScene from '../scenes/webaudio-scene';
import ResonatorAudioContext from '../audio-context';
import { SourceType } from './source-type';

export class StreamingSource implements BaseSource {
	public playing: boolean;
	private playOnAvailable: boolean;
	private node: MediaElementAudioSourceNode;
	private canPlay: boolean;
	private sceneNode: any;
	private gain: GainNode;
	private position: any;
	public constructor(
		private graph: AudioGraph,
		private scene: ResonatorScene,
		private context: ResonatorAudioContext,
		private element: HTMLAudioElement,
		private type: SourceType = SourceType.MasterSource
	) {
		this.position = {
			x: 0,
			y: 0,
			z: 0
		};
		this.init();
	}

	private init(): void {
		this.node = this.context.createMediaElementSource(this.element);
		this.gain = this.context.createGain();
		this.createConnections();
		this.element.addEventListener('canplay', (event) => {
			this.canPlay = true;
			if (this.playOnAvailable) {
				this.play();
			}
		});
	}

	public play(
		when: number = 0,
		offset: number = 0,
		duration: number = 0
	): void {
		if (this.canPlay) {
			this.element.play();
		}
		this.playOnAvailable = true;
	}

	public stop(): void {
		this.element.pause();
	}

	public getVolume(): number {
		return this.element.volume;
	}

	public setVolume(value: number): void {
		this.element.volume = value;
	}

	public getPlaybackRate(): number {
		return this.element.playbackRate;
	}

	public setPlaybackRate(value: number): void {
		this.element.playbackRate = value;
	}

	private createConnections(): void {
		switch (this.type) {
			case SourceType.WorldSource:
				if (!this.sceneNode) {
					this.sceneNode = this.scene.createSource();
				}
				this.node.connect(this.gain);
				this.gain.connect(this.sceneNode);

				break;
			default:
				this.node.connect(this.gain);
				this.graph.connectToMaster(this.gain);
				break;
		}
	}

	public setPosition(x: number, y: number, z: number): void {
		this.position = {
			x,
			y,
			z
		};
		if (this.sceneNode) this.sceneNode.setPosition(x, y, z);
	}

	public destroy(): void {
		this.stop();
		this.element = null;
		this.graph = null;
		this.context = null;
		this.node = null;
		this.sceneNode = null;
		this.scene = null;
	}

	public loop(value: boolean): void {
		this.element.loop = true;
	}

	public fadeIn(time: number): void {
		this.gain.gain.setValueAtTime(
			0.0001,
			this.context.getContext().currentTime
		);
		if (!this.node) {
			this.play();
		}
		this.gain.gain.exponentialRampToValueAtTime(
			this.getVolume(),
			this.context.getContext().currentTime + time
		);
	}

	public fadeOut(time: number): void {
		this.gain.gain.setValueAtTime(
			this.getVolume(),
			this.context.getContext().currentTime
		);
		if (!this.node) {
			return;
		}
		this.gain.gain.exponentialRampToValueAtTime(
			0.0001,
			this.context.getContext().currentTime + time
		);
		setTimeout(() => this.stop(), time * 1000);
	}
}
