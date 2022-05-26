// The code that deals with 3d audio

import ResonanceAudio from '../vendor/resonance-es6/main';
import ResonatorAudioContext from '../audio-context';
import EventEmitter from 'eventemitter3';
import vec3 from '../../math/vec3';

export default class Scene extends EventEmitter {
	scene: any;
	context: ResonatorAudioContext;
	listener: AudioListener;
	constructor(context: ResonatorAudioContext) {
		super();
		this.context = context;
		this.scene = new ResonanceAudio(this.context.getContext(), {
			ambisonicOrder: 3
		});
		this.listener = this.context.getContext().listener;
		this.init();
	}

	init(): void {
		// this.scene.output.connect(this.context.getOutputDestination());
	}

	createSource(): any {
		const source = this.scene.createSource();
		return {
			...source,
			getInput: () => source.input
		};
	}

	getOutput(): any {
		return this.scene.output;
	}

	getInput(): any {
		return this.scene.input;
	}

	setListenerPosition(x: number, y: number, z: number): void {
		this.scene.setListenerPosition(x, y, z);
	}

	setListenerOrientation(forward: any, rawup: any) {
		let fwd = new vec3([forward.x, forward.y, forward.z]);
		let up = fwd.copy();

		vec3.cross(up, new vec3([rawup.x, rawup.y, rawup.z]), up);
		vec3.cross(up, fwd, up);
		fwd.normalize();
		up.normalize();

		this.scene.setListenerOrientation(
			forward.x,
			forward.y,
			forward.z,
			rawup.x,
			rawup.y,
			rawup.z
		);
	}
}
