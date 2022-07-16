import { SceneManager } from './manager';



export abstract class Scene {
	id: string;
	data: any;

	// Called when the scene is activated
	onActivate(manager: SceneManager): void {
		console.log(`Scene ${this.id} activated`);
	}

	// Called when the scene is deactivated
	onDeactivate(): void {
		console.log(`Scene ${this.id} deactivated`);
	}

	// Called when the scene is switched to but not yet activated.
	onSwitch(data: any): void {
		this.data = data;
	}

	// Called every frame
	abstract update(dt: number): void;

	// Called when the update.draw event is fired
	abstract updateDraw(): void;
}
