import { SoundSet } from './interfaces/sound-set';
import { ScrollingText } from '.';

export class SoundManager {
	public constructor(
		private instance: ScrollingText,
		private soundSet: SoundSet
	) {}

	public setSoundSet(soundSet: SoundSet) {
		this.soundSet = soundSet;
	}

	public init(): void {
		this.instance.subscribe('character.appear', this.handleCharacterAppear.bind(this));
		this.instance.subscribe('open', this.handleOpen.bind(this));
		this.instance.subscribe('close', this.handleClose.bind(this));
		this.instance.subscribe('advance', this.handleAdvance.bind(this));
	}

	private handleOpen(): void {
		this.soundSet.open && this.soundSet.open.play();
	}

	private handleCharacterAppear(): void {
		this.soundSet.characterAppear && this.soundSet.characterAppear.play();
	}

	private handleAdvance(): void {
		this.soundSet.scroll && this.soundSet.scroll.play();
	}

	private handleClose(): void {
		this.soundSet.close && this.soundSet.close.play();
	}
}
