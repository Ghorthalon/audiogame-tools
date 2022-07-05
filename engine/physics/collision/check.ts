import { PhysicsObject } from "../object";
import { Terrain } from "../terrain";

export function BoxBox(a: PhysicsObject, b: PhysicsObject): boolean {
    return true;
}

function BoxTerrain(a: PhysicsObject, b: Terrain) {
    return true;
}