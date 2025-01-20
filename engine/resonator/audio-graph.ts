// this is the mixer that takes all the different outputs and mixes them into the 2 busses:
// WorldBus: The directional audio
// SecondaryBus: All the UI and things that are non directional

import ResonatorScene from './scenes/webaudio-scene';
import ResonatorAudioContext from './audio-context';
import BaseEffect from './effects/base-effect';
import EffectBus from './effect-bus';
import EffectChain from './effect-chain';

export default class AudioGraph {
	private master: any;
	private effectsBus: AudioNode;
	public worldBus: AudioNode;
	public secondaryBus: AudioNode;
	private effects: EffectChain;
	private scene: ResonatorScene;
	private context: ResonatorAudioContext;
	private swapChannels: boolean;
	private channelSplitter: ChannelSplitterNode;
	private channelMerger: ChannelMergerNode;
	constructor(
		scene: ResonatorScene,
		context: ResonatorAudioContext,
		swapChannels: boolean = false
	) {
		this.scene = scene;
		this.context = context;
		this.swapChannels = swapChannels;
		this.init();
	}

	init(): void {
		this.effectsBus = this.context.createGain();
		this.worldBus = this.context.createGain();
		this.secondaryBus = this.context.createGain();
		this.master = this.context.createGain();
		this.scene.getOutput().connect(this.worldBus);
		// this.worldBus.connect(this.master);
		this.worldBus.connect(this.effectsBus);
		this.effects = new EffectChain(
			this.context,
			this,
			this.effectsBus,
			this.master
		);
		this.secondaryBus.connect(this.master);
		if (this.swapChannels) {
			this.channelSplitter = this.context.getContext().createChannelSplitter(2);
			this.channelMerger = this.context.getContext().createChannelMerger(2);
			this.master.connect(this.channelSplitter);
			this.channelSplitter.connect(this.channelMerger, 0, 1);
			this.channelSplitter.connect(this.channelMerger, 1, 0);
			this.channelMerger.connect(this.context.getOutputDestination());
		} else {
			this.master.connect(this.context.getOutputDestination());
		}
	}

	connectToMaster(input: any) {
		input.connect(this.master);
	}

	connectToUI(input: AudioNode): void {
		input.connect(this.secondaryBus);
	}

	applyEffect(effect: BaseEffect) {
		this.effects.applyEffect(effect);
	}

	removeEffect(effect: BaseEffect) {
		this.effects.removeEffect(effect);
	}
}
