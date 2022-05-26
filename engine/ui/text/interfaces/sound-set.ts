import { IPlayableSound } from './playable-sound';

export interface SoundSet {
	open?: IPlayableSound;
	close?: IPlayableSound;
	scroll?: IPlayableSound;
	characterAppear?: IPlayableSound;
}
