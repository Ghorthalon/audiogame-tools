import Box from '../math/box';
import { PhysicsObject } from './object';

export function AABB(obj1: Box, obj2: Box) {
	if (
		checkOverlap(
			obj1.position.x,
			obj1.size.x,
			obj2.position.x,
			obj2.size.x
		)
	) {
		return true;
	} else if (
		checkOverlap(
			obj1.position.y,
			obj1.size.y,
			obj2.position.y,
			obj2.size.y
		)
	) {
		return true;
	} else if (
		checkOverlap(
			obj1.position.z,
			obj1.size.z,
			obj2.position.z,
			obj2.size.z
		)
	) {
		return true;
	}
	return false;
}

function checkOverlap(x: number, w: number, yx: number, yw: number) {
	if (x > yx || x < yx + yw || x + w > x || x + w < yx + yw) {
		return true;
	}
}
