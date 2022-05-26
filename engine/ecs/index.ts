import { BaseComponent, Component } from './component';
import { BaseEntity, Entity } from './entity';
import { EventBus } from '../event-bus';
import { Query } from './query';
import { System } from './system';

export class World {
	public entities: Array<BaseEntity>; // all entities
	public components: Map<number, Component>; // component definitions
	public componentNamesToIDs: Map<string, number>; // map component names to IDs for faster lookup
	public systems: Set<System>; // list of systems
	public nextEntityID = 0;
	public nextComponentID = 0;
	public nextQueryID = 0;
	public queryCache: Array<Query>;
	public eventBus: EventBus;
	public isRunning: boolean;
	public constructor() {
		this.entities = new Array();
		this.systems = new Set();
		this.components = new Map();
		this.componentNamesToIDs = new Map();
		this.queryCache = new Array();
		this.eventBus = new EventBus();
		this.isRunning = false;
	}

	public run() {
		if (!this.isRunning) {
			this.systems.forEach((system) => system.init(this));
		}
		this.systems.forEach((system) => {
			system.execute(this);
		});
	}

	public createSystem(systemExecutor: Function) {
		const newSystem = new System(systemExecutor);
		this.systems.add(newSystem);
		if (this.isRunning) newSystem.init(this);
	}

	public addSystem(system: System) {
		this.systems.add(system);
		if (this.isRunning) system.init(this);
	}

	public addEntity(entity: BaseEntity) {
		this.entities.push(entity);
		this.markQueriesDirty();
	}

	public removeEntity(entityToRemove: BaseEntity) {
		this.entities = this.entities.filter((entity) => entity !== entityToRemove);
		this.markQueriesDirty();
	}

	public createEntity(components: Array<Component>) {
		const newEntity = new BaseEntity();
		newEntity.id = this.nextEntityID;
		this.nextEntityID++;
		components.forEach((component) => {
			if (this.componentNamesToIDs.has(component.name)) {
				component.id = this.componentNamesToIDs.get(component.name);
			} else {
				this.componentNamesToIDs.set(component.name, this.nextComponentID);
				component.id = this.nextComponentID;
				this.nextComponentID++;
			}
			newEntity.addComponent(component);
		});
		this.entities.push(newEntity);
		this.markQueriesDirty();
		return newEntity;
	}

	public extendEntity(
		entity: Entity,
		components: Array<Component>
	): BaseEntity {
		const toClone = this.entities.find(
			(found) => entity.name === found.constructor.name
		);
		const cloned = new BaseEntity();
		cloned.id = this.nextEntityID;
		this.nextEntityID++;
		toClone.components.forEach((component) => {
			cloned.addComponent(this.components.get(component.id));
		});
		components.forEach((component) => {
			if (this.componentNamesToIDs.has(component.name)) {
				component.id = this.componentNamesToIDs.get(component.name);
			} else {
				this.componentNamesToIDs.set(component.name, this.nextComponentID);
				component.id = this.nextComponentID;
				this.nextComponentID++;
			}
			cloned.addComponent(component);
		});
		this.entities.push(cloned);
		return cloned;
	}

	public createComponent(component: Component) {
		const newComponent = component;
		newComponent.id = this.nextComponentID;
		this.nextComponentID++;
		this.components.set(newComponent.id, newComponent);
		this.componentNamesToIDs.set(component.name, component.id);
		return newComponent;
	}

	public query(
		include: Array<Component>,
		exclude: Array<Component>
	): Array<BaseEntity> {
		const query = new Query(include, exclude, this);
		const cache = this.queryCache.find(
			(item) => item.include == include && item.exclude == exclude
		);
		if (cache) {
			return cache.execute();
		}
		this.queryCache.push(query);
		return query.execute();
	}

	public createQuery(
		include: Array<Component>,
		exclude: Array<Component>
	): Query {
		const newQuery = new Query(include, exclude, this);
		newQuery.id = this.nextQueryID;
		this.nextQueryID++;
		this.queryCache.push(newQuery);
		return newQuery;
	}

	public markQueriesDirty() {
		this.queryCache.forEach((query) => (query.isDirty = true));
	}
}
