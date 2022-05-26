import { PhysicsObject } from './object';
import Vec3 from '../math/vec3';
import Box from "../math/box";
import { boolOptions } from 'yaml/types';

export class Octree {
	public root: OcTreeNode;
	public constructor(
		private dimensions: Vec3,
		private maxObjects: number = 10,
		private maxLevels: number = 10
	) {
		this.root = new OcTreeNode(
			new Box(
				new Vec3([
					0,
					0,
					0
				]),
				this.dimensions
			),
			maxLevels,
			maxObjects,
			0
		);
	}

	public insert(obj: PhysicsObject) {
		this.root.insert(obj);
	}

	public remove(obj: PhysicsObject) {
		this.root.remove(obj);
	}

	public find(area: Box): PhysicsObject[] {
		return this.root.find(
			area
		);
	}
}

export class OcTreeNode {
	public objects: PhysicsObject[];
	public nodes: OcTreeNode[];
	public constructor(
		private boundingBox: Box,
		private maxLevels: number,
		private maxObjects: number,
		private currentLevel: number = 0
	) {
		this.objects = [];
		this.nodes = [];
	}

	public insert(obj: PhysicsObject) {
		if (!obj.boundingBox.overlaps(this.boundingBox)) return;
		if (this.nodes.length > 1) {
			for (let i = 0; i < this.nodes.length-1; i++) {
				this.nodes[i].insert(obj);
			}
		} else {
			this.objects.push(obj);
			if (this.objects.length > this.maxObjects) {
				this.split();
			}
		}
	}

	public remove(obj: PhysicsObject) {
		if (obj.boundingBox.overlaps(this.boundingBox)) {
			if (this.nodes.length > 1) {
				for (let i = 0; i < this.nodes.length-1; i++) {
					this.nodes[i].remove(obj);
				}
			}
		}
		if (this.objects.includes(obj)) {
			this.objects = this.objects.filter((item) => item !== obj);
		}
	}

	public find(
		area: Box
	): PhysicsObject[] {
		let result = [];
		if (area.overlaps(this.boundingBox)) {
			if (this.nodes.length > 1) {
				for (let i = 0; i < this.nodes.length; i++) {
					let res = this.nodes[i].find(area);
					if (res.length > 0) res.forEach((item) => result.push(item));
				}
			}
			if (this.objects.length > 0) this.objects.forEach((item) => result.push(item));
		}
		return result;
	}

	public split() {
		if (this.currentLevel == this.maxLevels) return;
		const halfWidth = this.boundingBox.size.x / 2;
		const halfHeight = this.boundingBox.size.y / 2;
		const halfDepth = this.boundingBox.size.z / 2;

		this.nodes[Direction.AboveUpperLeft] = new OcTreeNode(
			new Box(
				new Vec3([
					this.boundingBox.position.x,
					this.boundingBox.position.y,
					this.boundingBox.position.z + halfDepth
				]),
				new Vec3([
					halfWidth,
					halfHeight,
					halfDepth
				])
			),
			this.maxLevels,
			this.maxObjects,
			this.currentLevel+1
		);

		this.nodes[Direction.AboveUpperRight] = new OcTreeNode(
			new Box(
				new Vec3([
					this.boundingBox.position.x + halfWidth,
					this.boundingBox.position.y,
					this.boundingBox.position.z + halfDepth
				]),
				new Vec3([
					halfWidth,
					halfHeight,
					halfDepth
				])
			),
			this.maxLevels,
			this.maxObjects,
			this.currentLevel+1
		);

		this.nodes[Direction.AboveLowerRight] = new OcTreeNode(
			new Box(
				new Vec3([
					this.boundingBox.position.x + halfWidth,
					this.boundingBox.position.y + halfHeight,
					this.boundingBox.position.z + halfDepth
				]),
				new Vec3([
					halfWidth,
					halfHeight,
					halfDepth
				])
			),
			this.maxLevels,
			this.maxObjects,
			this.currentLevel+1
		);

		this.nodes[Direction.AboveLowerLeft] = new OcTreeNode(
			new Box(
				new Vec3([
					this.boundingBox.position.x,
					this.boundingBox.position.y + halfHeight,
					this.boundingBox.position.z + halfDepth
				]),
				new Vec3([
					halfWidth,
					halfHeight,
					halfDepth
				])
			),
			this.maxLevels,
			this.maxObjects,
			this.currentLevel+1
		);

		this.nodes[Direction.BelowUpperLeft] = new OcTreeNode(
			new Box(
				new Vec3([
					this.boundingBox.position.x,
					this.boundingBox.position.y,
					this.boundingBox.position.z
				]),
				new Vec3([
					halfWidth,
					halfHeight,
					halfDepth
				])
			),
			this.maxLevels,
			this.maxObjects,
			this.currentLevel+1
		);

		this.nodes[Direction.BelowUpperRight] = new OcTreeNode(
			new Box(
				new Vec3([
					this.boundingBox.position.x + halfWidth,
					this.boundingBox.position.y,
					this.boundingBox.position.z
				]),
				new Vec3([
					halfWidth,
					halfHeight,
					halfDepth
				])
			),
			this.maxLevels,
			this.maxObjects,
			this.currentLevel+1
		);

		this.nodes[Direction.BelowLowerRight] = new OcTreeNode(
			new Box(
				new Vec3([
					this.boundingBox.position.x + halfWidth,
					this.boundingBox.position.y + halfHeight,
					this.boundingBox.position.z
				]),
				new Vec3([
					halfWidth,
					halfHeight,
					halfDepth
				])
			),
			this.maxLevels,
			this.maxObjects,
			this.currentLevel+1
		);

		this.nodes[Direction.BelowLowerLeft] = new OcTreeNode(
			new Box(
				new Vec3([
					this.boundingBox.position.x,
					this.boundingBox.position.y + halfHeight,
					this.boundingBox.position.z
				]),
				new Vec3([
					halfWidth,
					halfHeight,
					halfDepth
				])
			),
			this.maxLevels,
			this.maxObjects,
			this.currentLevel+1
		);

		this.distributeObjectsToNodes();
	}

	private distributeObjectsToNodes() {
		if (this.nodes.length < 8) {
			this.split();
			return;
		}
		for (let i = 0; i < this.objects.length; i++) {
			for (let j = 0; j < this.nodes.length-1; j++) {
				this.nodes[j].insert(this.objects[i]);
			}
		}
		this.objects = [];
	}
}


enum Direction {
	AboveUpperLeft,
	AboveUpperRight,
	AboveLowerRight,
	AboveLowerLeft,
	BelowUpperLeft,
	BelowUpperRight,
	BelowLowerRight,
	BelowLowerLeft,
	Here
}
