import Box from "../math/box";
import vec3 from "../math/vec3";
import quat from "../math/quat";
import { ObjectType } from "./object-type";

export class PhysicsObject {
	public type: ObjectType;
	public boundingBox: Box;
	public rotation: quat;
	public velocity: vec3;
	public affectedByGravity: boolean;
	public collides: boolean;
	public isStatic: boolean;
	public isDirty: boolean;

	public constructor() {
		this.type = ObjectType.object;
		this.boundingBox = new Box(
			new vec3([0, 0, 0]),
			new vec3([1, 1, 1])
		);
		this.rotation = new quat();
		this.velocity = new vec3([0, 0, 0]);
		this.affectedByGravity = true;
		this.collides = true;
		this.isStatic = false;
		this.isDirty = true;
	}

	public move(position: vec3) {
		if (this.isStatic) return;
		this.boundingBox.position = position;
		this.isDirty = true;
	}

	public lookAt(position: vec3) {
		this.rotation = quat.fromVectors(this.boundingBox.position.copy(), position.copy())
	}

	public collidesWith(obj: PhysicsObject): boolean {
		if (obj.type !== ObjectType.terrain) {
			return this.boundingBox.overlaps(obj.boundingBox);
		} else {
			return obj.collidesWith(this);
		}
		return false;
	}
}

