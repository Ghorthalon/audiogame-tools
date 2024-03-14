// The code that deals with 3d audio

import ResonatorAudioContext from '../audio-context';
import { EventBus } from '../../event-bus';
import vec3 from '../../math/vec3';

export default class ResonatorScene extends EventBus {
	scene: GainNode;
	context: ResonatorAudioContext;
	listener: AudioListener;
	constructor(context: ResonatorAudioContext) {
		super();
		this.context = context;
		this.scene = this.context.getContext().createGain();
		this.listener = this.context.getContext().listener;
		this.init();
	}

	init(): void {
		// this.scene.output.connect(this.context.getOutputDestination());
	}

	createSource(): any {
		const node = this.context.getContext().createPanner();
		node.panningModel = 'HRTF';
		node.distanceModel = 'linear';
		node.maxDistance = 20;
		node.refDistance = 2;
		node.connect(this.scene);
		return node;
	}

	getOutput(): any {
		return this.scene;
	}

	getInput(): any {
		return this.scene;
	}

	setListenerPosition(x: number, y: number, z: number): void {
		this.listener.setPosition(x, y, z);
	}

	setListenerOrientation(forward: any, rawup: any) {
		let fwd = new vec3([forward.x, forward.y, forward.z]);
		let up = fwd.copy();

		vec3.cross(up, new vec3([rawup.x, rawup.y, rawup.z]), up);
		vec3.cross(up, fwd, up);
		fwd.normalize();
		up.normalize();

		this.listener.setOrientation(fwd.x, fwd.y, fwd.z, up.x, up.y, up.z);
	}
}
