import BaseEffect from './base-effect';
import ResonatorAudioContext from '../audio-context';
import AudioGraph from '../audio-graph';

export default class Convolver extends BaseEffect {
	private buffer: AudioBuffer;
	private channelSplitter: ChannelSplitterNode;
	private channelMerger: ChannelMergerNode;
	private outputGain: GainNode;
	private volume: number = 0.25;
	constructor(context: ResonatorAudioContext, graph: AudioGraph, params: any) {
		super(context, graph, params);
		console.log(`Creating convolver`);
		this.effectNode = this.context.getContext().createConvolver();
		this.effectNode.normalize = true;
		this.effectNode.buffer = this.effectParams.buffer;
	}

	setVolume(volume: number) {
		this.volume = volume;
		if (this.outputGain) {
			this.outputGain.gain.setValueAtTime(this.volume, this.context.getContext().currentTime);
		}
	}

	connectInput(node: AudioNode) {
		this.channelSplitter = this.context.getContext().createChannelSplitter(2);
		this.channelMerger = this.context.getContext().createChannelMerger(2);
		this.channelSplitter.connect(this.channelMerger, 0, 0);
		this.channelSplitter.connect(this.channelMerger, 1, 0);
		this.channelSplitter.connect(this.channelMerger, 0, 1);
		this.channelSplitter.connect(this.channelMerger, 1, 1);
		this.outputGain = this.context.getContext().createGain();
		this.outputGain.gain.setValueAtTime(this.volume, this.context.getContext().currentTime);
		node.connect(this.channelSplitter);
		this.channelMerger.connect(this.outputGain);
		this.outputGain.connect(this.effectNode);
		this.inputNode = node;
	}
}
