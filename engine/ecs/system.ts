import { World } from '.';
import { BaseEntity } from './entity';
import { Query } from './query';

export class System {
	public executor: Function;
	public query: Query;
	public constructor(executor: Function) {
		this.executor = executor;
	}

	public execute(world: World) {
		if (this.executor) {
			this.executor(world);
		}
	}

	public setQuery(query: Query) {
		this.query = query;
	}

	public getQuery(): Query {
		return this.query;
	}

	public executeQuery(): Array<BaseEntity> {
		return this.query.execute();
	}

	public init(world: World) {
		return;
	}
}