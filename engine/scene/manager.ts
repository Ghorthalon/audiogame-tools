import { Game } from '../game';
import { Scene } from './scene';

export class SceneManager {
	public scenes: Map<string, Scene>;
	public currentScene: Scene;
	public defaultScene: Scene;
	public constructor() {
		this.scenes = new Map();
	}

	public init() {
		if (this.defaultScene) {
			this.switchTo(this.defaultScene);
		}
	}

	public addScene(scene: Scene) {
		this.scenes.set(scene.id, scene);
	}

	public removeScene(scene: Scene) {
		if (scene === this.currentScene) this.currentScene.onDeactivate();
		this.scenes.delete(scene.id);
	}

	public switchTo(scene: Scene) {
		if (scene === this.currentScene) return;
		let data;
		if (this.currentScene) {
			this.currentScene.onDeactivate();
			data = this.currentScene.data;
		}
		this.currentScene = this.scenes.get(scene.id);
		this.currentScene.onSwitch(data);
		this.currentScene.onActivate(this);
	}

	public setDefaultScene(scene: Scene) {
		this.defaultScene = scene;
	}
}
