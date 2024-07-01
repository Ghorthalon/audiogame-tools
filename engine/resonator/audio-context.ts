// simple wrapper around the AudioContext
// eventually will be used to deal with cross browser issues

export default class ResonatorAudioContext {
	private context: AudioContext;
	constructor() {
		this.context = new AudioContext();
	}

	getContext() {
		return this.context;
	}

	createGain(): any {
		return this.context.createGain();
	}

	getOutputDestination(): AudioNode {
		return this.context.destination;
	}

	createBufferSource(): AudioBufferSourceNode {
		return this.context.createBufferSource();
	}

	async decodeAudioData(data: ArrayBuffer): Promise<AudioBuffer> {
		try {
			return await this.context.decodeAudioData(data);
		} catch (e) {
			console.error(e);
		}

	}

	createPanner(): any {
		return this.context.createPanner();
	}

	createMediaElementSource(
		element: HTMLMediaElement
	): MediaElementAudioSourceNode {
		return this.context.createMediaElementSource(element);
	}
}
