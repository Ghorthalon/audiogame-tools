import { BaseComponent, Component } from './component';

export class BaseEntity {
	public id: number;
	public components: Map<number, BaseComponent>;
	public constructor() {
		this.components = new Map();
		this.id = 0;
	}

	public addComponent(component: Component) {
		let comp = new component();
		comp.id = component.id;
		this.components.set(component.id, comp);
	}

	public removeComponent(component: BaseComponent) {
		this.components.delete(component.id);
	}

	public getComponentIDs(): number[] {
		return [...this.components.keys()];
	}

	public getComponent(component: BaseComponent) {
		return this.components.get(component.id);
	}

	public getComponentByID(id: number): BaseComponent {
		return this.components.get(id);
	}
}

export interface Entity {
	new (): BaseComponent;
	addComponent(component: Component);
	removeComponent(component: BaseComponent);
	getComponentIDs(): number[];
	getComponent(component: BaseComponent);
	getComponentByID(id: number): BaseComponent;
}
