import { Octree } from './octree';
import { EventBus } from '../event-bus';
import { PhysicsObject } from './object';
import Vec3 from '../math/vec3';
import { Terrain } from './terrain';
import vec3 from '../math/vec3';

export class World extends EventBus {
	public objects: PhysicsObject[];
	public terrain: Terrain[];
	public gravity: Vec3;
	public dimensions: Vec3;
	public octreeOptions: OctreeOptions;
	public octree: Octree;
	public constructor(dimensions: Vec3, octreeOptions: OctreeOptions) {
		super();
		if (!octreeOptions) {
			this.octreeOptions = {
				position: new Vec3([ 0, 0, 0 ]),
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
	}

	public setGravity(grav: Vec3) {
		this.gravity = grav;
	}

	public addObject(obj: PhysicsObject) {
		this.objects.push(obj);
		this.octree.insert(obj);
	}

	public removeObject(obj: PhysicsObject) {
		this.objects = this.objects.filter((val) => val !== obj);
		this.octree.remove(obj);
	}

	public step(dt: number) {
		this.objects.forEach((obj) => {
			if (obj.isDirty) {
				this.octree.remove(obj);
				this.octree.insert(obj);
				obj.isDirty = false;
			}
			let velocity = obj.velocity.copy();
			velocity.multiply(new Vec3([ dt, dt, dt ]));
			let gravity = this.gravity.copy();
			gravity.multiply(new Vec3([ dt, dt, dt ]));
			if (obj.affectedByGravity) {
				obj.velocity.add(gravity);
			}
			obj.boundingBox.position.add(velocity);
			if (obj.velocity.length() != 0) {
				obj.isDirty = true;
			}
			this.checkCollisions(obj, dt);
		});
	}

	public checkCollisions(obj: PhysicsObject, dt: number) {
		if (!obj.boundingBox) {
			return;
		}
		if (!obj.collides) return;
		const potentialCandidates = this.octree.find(obj.boundingBox);
		if (!potentialCandidates || potentialCandidates.length === 0) return;
		potentialCandidates.forEach((candidate) => {
			if (candidate === obj) return;
			if (!candidate) return;
			if (!candidate.collides) return;
			if (obj.collidesWith(candidate)) {
				this.emit('collision', [obj, candidate]);
				obj.velocity.negate();
				obj.boundingBox.position.add(obj.velocity.multiply(new vec3([dt, dt, dt])));
				obj.velocity = new Vec3([0, 0, 0]);
			}
		});
	}
}

interface OctreeOptions {
	position: Vec3;
	dimensions: Vec3;
	maxObjects: number;
	maxLevels: number;
}
