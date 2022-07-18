import { InputType } from '../input/inputs/base-input';

export class GameConfig {
	// The name of the game
	name: string;
	// Which input handlers to register
	inputTypes: InputType[];
	// The base directory to be passed to the asset manager from which assets are retrieved
	assetDirectory: string;
	// How many times a second to fire the update event
	updatesPerSecond: number = 60;
}
