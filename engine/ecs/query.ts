import { World } from '.';
import { BaseComponent, Component } from './component';
import { BaseEntity } from './entity';

export class Query {
	public id: number;
	private results: Array<BaseEntity>;
	public isDirty: boolean;
	public includeComponentIds: number[];
	public excludeComponentIds: number[];
	public constructor(
		public include: Array<Component>,
		public exclude: Array<Component>,
		public world: World
	) {
		this.isDirty = true;
		this.results = new Array();
		this.includeComponentIds = include.map((component) => component.id);
		this.excludeComponentIds = exclude.map((component) => component.id);
		this.id = 0;
	}

	public execute(): Array<BaseEntity> {
		if (!this.isDirty && this.results) {
			return this.results;
		}
		let filtered: Array<Component>;
		this.includeComponentIds = this.include.map((component) =>
			this.world.componentNamesToIDs.get(component.name)
		);
		this.excludeComponentIds = this.exclude.map((component) =>
			this.world.componentNamesToIDs.get(component.name)
		);
		const entities: BaseEntity[] = this.world.entities.filter((entity) => {
			let ids = entity.getComponentIDs();
			// let includes = ids.map(id => this.includeComponentIds.includes(id)).includes(true);
			let excludes = ids
				.map((id) => this.excludeComponentIds.includes(id))
				.includes(true);
			let includes = ids.filter((id) => this.includeComponentIds.includes(id));
			return includes.length === this.includeComponentIds.length && !excludes;
		});
		if (entities.length > 0) {
			this.isDirty = false;
			this.results = entities;
		}
		return entities;
	}
}
