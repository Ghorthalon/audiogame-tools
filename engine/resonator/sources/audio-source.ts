// an audio source
// This is the actual sound

import ResonatorAudioContext from '../audio-context';
import AudioGraph from '../audio-graph';
import ResonatorScene from '../scenes/webaudio-scene';
import { BaseSource } from './base-source';
import { SourceType } from './source-type';

export default class AudioSource implements BaseSource {
	public playing: boolean;
	public looping: boolean;
	private node: AudioBufferSourceNode;
	private sceneNode: any;
	private buffer: AudioBuffer;
	private context: ResonatorAudioContext;
	private graph: AudioGraph;
	private scene: ResonatorScene;
	private playOnLoad: boolean;
	private position: { x: number; y: number; z: number };
	private playbackRate: number;
	private volume: number;
	private gain: GainNode;
	private type: SourceType;
	constructor(
		graph: AudioGraph,
		scene: ResonatorScene,
		context: ResonatorAudioContext,
		buffer: AudioBuffer = null,
		type: SourceType = SourceType.WorldSource
	) {
		this.position = {
			x: 0,
			y: 0,
			z: 0
		};
		this.buffer = buffer;
		this.context = context;
		this.scene = scene;
		this.graph = graph;
		this.type = type;
		this.playbackRate = 1;
		this.volume = 1;
		this.init();
	}

	init(): void {
		this.gain = this.context.createGain();
		// bind methods so we can add and removve them from event listeners
		this.stop = this.stop.bind(this);
	}

	getBuffer(): AudioBuffer {
		return this.buffer;
	}
	setBuffer(data: AudioBuffer): void {
		this.buffer = data;
		if (this.playOnLoad) {
			this.play();
			this.playOnLoad = false;
		}
	}

	play(
		when: number = 0,
		offset: number = 0,
		duration: number = this.buffer ? this.buffer.duration : 0
	): void {
		if (this.playing && this.node) {
			this.stop();
		}
		if (!this.buffer) {
			this.playOnLoad = true;
			return;
		}
		if (!this.node) {
			this.node = this.context.createBufferSource();
			this.node.buffer = this.buffer;
			this.createConnections();
		}
		if (this.node) {
			this.node.playbackRate.value = this.playbackRate;
			this.node.start(when, offset, duration);

			this.node.loop = this.looping;
			this.playing = true;
			if (this.sceneNode) {
				this.sceneNode.setPosition(
					this.position.x,
					this.position.y,
					this.position.z
				);
			}
			this.node.addEventListener('ended', this.stop);
		}
	}

	setPosition(x: number, y: number, z: number): void {
		this.position = {
			x,
			y,
			z
		};
		if (this.sceneNode) this.sceneNode.setPosition(x, y, z);
	}

	setPlaybackRate(rate: number): void {
		this.playbackRate = rate;
		if (this.node) this.node.playbackRate.value = rate;
	}

	getPlaybackRate(): number {
		return this.playbackRate;
	}

	setVolume(volume: number): void {
		this.volume = volume;
		if (this.gain) this.gain.gain.value = volume;
	}

	getVolume(): number {
		return this.volume;
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
			case SourceType.UISource:
				this.node.connect(this.gain);
				this.graph.connectToUI(this.gain);
				break;
			default:
				this.node.connect(this.gain);
				this.graph.connectToMaster(this.gain);
				break;
		}
	}

	public stop(): void {
		this.playing = false;
		if (this.node) {
			this.node.removeEventListener('ended', this.stop);
			this.node.stop();
			this.node.disconnect();
			this.node = null;
			this.playing = false;
			if (this.sceneNode) {
				this.sceneNode.disconnect();
				this.sceneNode = null;
			}
		}
	}

	public destroy(): void {
		this.stop();
		// set all refs to null to encourage gc
		this.node = null;
		this.sceneNode = null;
		this.buffer = null;
		this.context = null;
		this.graph = null;
		this.scene = null;
	}

	public loop(value: boolean): void {
		this.looping = value;
		if (this.node) {
			this.node.loop = value;
		}
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

	public fadeIn(time: number): void {
		this.gain.gain.setValueAtTime(
			0.0001,
			this.context.getContext().currentTime
		);
		if (!this.node) {
			this.play();
		}
		this.gain.gain.exponentialRampToValueAtTime(
			this.volume,
			this.context.getContext().currentTime + time
		);
	}
}
