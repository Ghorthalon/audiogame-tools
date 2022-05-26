import ResonatorAudioContext from '../audio-context';
import AudioGraph from '../audio-graph';

export default class BaseEffect {
	protected ready: boolean;
	protected effectNode: any;
	protected effectParams: any;
	protected context: ResonatorAudioContext;
	protected graph: AudioGraph;
	protected inputNode: AudioNode;
	constructor(context: ResonatorAudioContext, graph: AudioGraph, params: any) {
		this.graph = graph;
		this.context = context;
		this.effectParams = params;
	}

	connectOutput(node: AudioNode) {
		this.effectNode.connect(node);
	}

	connectInput(node: AudioNode) {
		this.inputNode = node;
		if (this.effectNode) {
			this.inputNode.connect(this.effectNode);
		}
	}

	getOutput(): AudioNode {
		return this.effectNode;
	}

	disconnect() {
		this.inputNode.disconnect();
		this.effectNode.disconnect();
	}
}
