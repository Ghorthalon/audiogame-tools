import BaseEffect from './base-effect';
import ResonatorAudioContext from '../audio-context';
import AudioGraph from '../audio-graph';

export default class Convolver extends BaseEffect {
	private buffer: AudioBuffer;
	private channelSplitter: ChannelSplitterNode;
	private channelMerger: ChannelMergerNode;
	constructor(context: ResonatorAudioContext, graph: AudioGraph, params: any) {
		super(context, graph, params);
		console.log(`Creating convolver`);
		this.effectNode = this.context.getContext().createConvolver();
		this.effectNode.buffer = this.effectParams.buffer;
	}

	connectInput(node: AudioNode) {
		this.channelSplitter = this.context.getContext().createChannelSplitter(2);
		this.channelMerger = this.context.getContext().createChannelMerger(2);
		this.channelSplitter.connect(this.channelMerger, 0, 0);
		this.channelSplitter.connect(this.channelMerger, 1, 0);
		this.channelSplitter.connect(this.channelMerger, 0, 1);
		this.channelSplitter.connect(this.channelMerger, 1, 1);
		node.connect(this.channelSplitter);
		this.channelMerger.connect(this.effectNode);
		this.inputNode = node;
	}
}
