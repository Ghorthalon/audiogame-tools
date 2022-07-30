import { EventBus } from '../event-bus';
import Vec3 from '../math/vec3';
import { Broadphase } from './broadphase';
import { CollisionMatrix } from './collision';
import { CollisionDiff } from './collision/diff';
import { Narrowphase } from './narrowphase';
import { PhysicsObject } from './object';
import { Octree } from './octree';
import { Processor } from './processor';
import { Terrain } from './terrain';

export class World extends EventBus {
	public objects: PhysicsObject[];
	public terrain: Terrain[];
	public gravity: Vec3;
	public dimensions: Vec3;
	public octreeOptions: OctreeOptions;
	public octree: Octree;
	public deltaTime: number;
	public narrowphase: Narrowphase;
	public broadphase: Broadphase;
	public collisionMatrix: CollisionMatrix;
	public collisionDiff: CollisionDiff;
	public processors: Processor[];

	public constructor(dimensions: Vec3, octreeOptions?: OctreeOptions) {
		super();
		if (!octreeOptions) {
			this.octreeOptions = {
				position: new Vec3([0, 0, 0]),
				dimensions: this.dimensions,
				maxLevels: 50,
				maxObjects: 50
			};
		} else {
			this.octreeOptions = octreeOptions;
		}
		this.dimensions = dimensions;
		this.objects = [];
		this.octree = new Octree(
			this.octreeOptions.dimensions,
			this.octreeOptions.maxObjects,
			this.octreeOptions.maxLevels
		);
		this.narrowphase = new Narrowphase(this);
		this.broadphase = new Broadphase(this);
		this.collisionMatrix = new CollisionMatrix(this);
		this.collisionDiff = new CollisionDiff(this);
		this.processors = [];
	}

	public addProcessor(processor: Processor): void {
		this.processors.push(processor);
	}

	public setGravity(grav: Vec3): void {
		this.gravity = grav;
	}

	public addObject(obj: PhysicsObject): void {
		this.objects.push(obj);
		this.octree.insert(obj);
	}

	public removeObject(obj: PhysicsObject): void {
		this.objects = this.objects.filter((val) => val !== obj);
		this.octree.remove(obj);
	}

	public step(dt: number): void {
		const objects = this.objects;
		this.deltaTime = dt;
		for (let i = 0; i < objects.length; i++) {
			const obj = objects[i];
			if (obj.isDirty) {
				this.octree.remove(obj);
				this.octree.insert(obj);
				obj.isDirty = false;
			}
			const velocity = obj.velocity.copy();
			velocity.multiply(new Vec3([dt, dt, dt]));
			const gravity = this.gravity.copy();
			gravity.multiply(new Vec3([dt, dt, dt]));
			if (obj.affectedByGravity) {
				obj.velocity.add(gravity);
			}
			obj.boundingBox.position.add(velocity);
			if (obj.velocity.length() != 0) {
				obj.isDirty = true;
			}
			this.checkCollisions(obj, dt);
		}
	}

	public checkCollisions(obj: PhysicsObject, dt: number): void {
		this.collisionMatrix = new CollisionMatrix(this);
		const candidates = this.broadphase.execute();
		this.narrowphase.perform(candidates);
		this.collisionDiff.currMatrix = this.collisionMatrix;
		this.collisionDiff.perform();
	}
}

interface OctreeOptions {
	position: Vec3;
	dimensions: Vec3;

	maxObjects: number;
	maxLevels: number;
}
