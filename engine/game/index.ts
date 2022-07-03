import { AssetManager } from '../asset-manager';
import { EventBus } from '../event-bus';
import { Input } from '../input';
import Resonator from '../resonator';
import { HTTPLoader } from '../resonator/loaders/http-loader';
import { SceneManager } from '../scene/manager';
import { Scene } from '../scene/scene';
import { Scheduler } from '../scheduler';
import { TTS } from '../tts';
import { AriaOutput } from '../tts/outputs/aria';
import { World } from '../world';

export class Game extends EventBus {
	public assetLoader: HTTPLoader;
	public assetManager: AssetManager;
	public resonator: Resonator;
	public input: Input;
	public tts: TTS;
	public sceneManager: SceneManager;
	public scheduler: Scheduler;
	public world: World;
	public constructor() {
		super();
		this.init();
	}

	public init() {
		this.assetManager = new AssetManager('game', '');
		this.assetLoader = new HTTPLoader();
		this.resonator = new Resonator(this.assetLoader);
		this.input = new Input(['keyboard'], document.body);
		this.tts = new TTS(new AriaOutput());
		this.sceneManager = new SceneManager();
		this.scheduler = new Scheduler(60);
		this.emit('ready');
	}

	public start() {
		this.scheduler.start();
		this.scheduler.subscribe('update.logic', (dt) => {
			this.sceneManager.currentScene?.update(dt);
			this.world.update(dt);
		});
		this.scheduler.subscribe('update.draw', (dt) =>
			this.sceneManager.currentScene?.updateDraw()
		);
		this.sceneManager.init();
	}

	public addScene(scene: Scene) {
		this.sceneManager.addScene(scene);
	}

	public addDefaultScene(scene: Scene) {
		this.sceneManager.addScene(scene);
		this.sceneManager.setDefaultScene(scene);
	}

	public setWorld(world: World) {
		this.world = world;
	}
}
