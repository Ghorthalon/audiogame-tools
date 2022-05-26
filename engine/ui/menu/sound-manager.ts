import { SoundSet } from './interfaces/sound-set';

export class SoundManager {
	private soundSet: SoundSet = null;
	private data: Map<string, any> = new Map();
	constructor(soundSet: SoundSet = null) {
		this.soundSet = soundSet;
	}

	public setSoundSet(soundSet: SoundSet) {
		this.soundSet = soundSet;
	}

	handleSound(type: string, data: any = null) {
		switch (type) {
			case 'edit':
				this.handleEditSound(data);
				break;
			case 'slider':
				this.handleSliderSound(data);
				break;
			case 'selector':
				this.handleSelectorSound(data);
				break;
			case 'checkbox':
				this.handleCheckboxSound(data);
				break;
			case 'focus':
				this.handleFocusSound();
				break;
			case 'choose':
				this.handleChooseSound();
				break;
			case 'open':
				this.handleOpenSound();
				break;
			case 'close':
				this.handleCloseSound();
				break;
			default:
				return;
				break;
		}
	}

	private handleEditSound(data: any) {
		const prevData = this.data.get('edit') || '';
		if (data.length <= prevData.length) {
			this.soundSet.delete && this.soundSet.delete.play();
		} else {
			this.soundSet.char && this.soundSet.char.play();
		}
		this.data.set('edit', data);
	}

	private handleSelectorSound(data: any) {
		this.soundSet.scroller && this.soundSet.scroller.play();
	}

	private handleSliderSound(data: any) {
		const prevData = this.data.get('slider');
		if (data < prevData) {
			this.soundSet.sliderLeft && this.soundSet.sliderLeft.play();
		} else {
			this.soundSet.sliderRight && this.soundSet.sliderRight.play();
		}
		this.data.set('slider', data);
	}

	private handleFocusSound(): void {
		this.soundSet.move && this.soundSet.move.play();
	}

	private handleOpenSound(): void {
		this.soundSet.open && this.soundSet.open.play();
	}

	private handleCloseSound(): void {
		this.soundSet.close && this.soundSet.close.play();
	}

	private handleChooseSound(): void {
		this.soundSet.choose && this.soundSet.choose.play();
	}

	private handleCheckboxSound(data: any) {
		if (data === true) {
			this.soundSet.checked && this.soundSet.checked.play();
		} else {
			this.soundSet.unchecked && this.soundSet.unchecked.play();
		}
	}
}
