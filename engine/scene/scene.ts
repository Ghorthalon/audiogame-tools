import { Game } from '../game';
import { SceneManager } from './manager';

export interface Scene {
	id: string;
	data: any;
	onActivate(manager: SceneManager);
	onDeactivate();
	onSwitch(data: any);
	update(dt: number);
	updateDraw();
}
