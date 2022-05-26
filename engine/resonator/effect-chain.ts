// A chain of effects that connect to the effect bus

import EventEmitter from 'eventemitter3';
import ResonatorAudioContext from './audio-context';
import AudioGraph from './audio-graph';
import BaseEffect from './effects/base-effect';

export default class EffectChain {
	private context: ResonatorAudioContext;
	private graph: AudioGraph;
	private effects: BaseEffect[] = [];
	private inputNode: AudioNode;
	private outputNode: AudioNode;
	constructor(
		context: ResonatorAudioContext,
		graph: AudioGraph,
		input: AudioNode,
		output: AudioNode
	) {
		this.context = context;
		this.graph = graph;
		this.inputNode = input;
		this.outputNode = output;
		this.updateConnections();
	}

	public applyEffect(effect: BaseEffect) {
		this.effects.push(effect);
		this.updateConnections();
	}

	public removeEffect(effect: BaseEffect) {
		this.effects.forEach((currEffect) => {
			if (effect === currEffect) {
				currEffect.disconnect();
			}
		});
		this.effects = this.effects.filter((currEffect) => effect !== currEffect);
		this.updateConnections();
	}

	private updateConnections() {
		if (this.effects.length == 0) {
			this.inputNode.connect(this.outputNode);
			return;
		}
		let current: BaseEffect = null;
		let previous: BaseEffect = null;
		this.effects.forEach((effect: BaseEffect) => {
			current = effect;
			if (previous) {
				current.connectInput(previous.getOutput());
			} else {
				current.connectInput(this.inputNode);
			}
			previous = current;
		});
		if (current) {
			current.connectOutput(this.outputNode);
		}
	}
}
