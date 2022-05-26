// Currently unused, but eventually all the effect stuff will be moved from audio graph to here to make it easier to work on

import ResonatorAudioContext from './audio-context';

export default class EffectBus {
	private context: ResonatorAudioContext;
	private inputNode: AudioNode;
	private channelMerger: ChannelMergerNode;
	constructor(
		context: ResonatorAudioContext,
		input: AudioNode,
		output: AudioNode
	) {
		this.context = context;
		this.inputNode = input;
		this.channelMerger = this.context.getContext().createChannelMerger(1);
		this.inputNode.connect(this.channelMerger);
	}

	connect(node: AudioNode) {
		this.channelMerger.connect(node);
	}
}
