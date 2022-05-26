export interface BaseSource {
	play(when: number, offset: number, duration: number): void;
	stop(): void;
	setPlaybackRate(value: number): void;
	getPlaybackRate(): number;
	setVolume(value: number): void;
	getVolume(): number;
	loop(value: boolean): void;
	fadeOut(time: number): void;
	fadeIn(time: number): void;
	destroy(): void;
}
