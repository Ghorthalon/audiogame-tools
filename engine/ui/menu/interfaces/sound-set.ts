import { IPlayableSound } from './playable-sound';

export interface SoundSet {
	open?: IPlayableSound;
	close?: IPlayableSound;
	boundary?: IPlayableSound;
	choose?: IPlayableSound;
	move?: IPlayableSound;
	scroller?: IPlayableSound;
	sliderLeft?: IPlayableSound;
	sliderRight?: IPlayableSound;
	wrap?: IPlayableSound;
	char?: IPlayableSound;
	delete?: IPlayableSound;
	enter?: IPlayableSound;
	checked?: IPlayableSound;
	unchecked?: IPlayableSound;
}
