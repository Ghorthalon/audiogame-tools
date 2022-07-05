import Box from "../../math/box";
import { PhysicsObject } from "../object";
import { Terrain } from "../terrain";

export function BoxBoxSolver(a: Box, b: Box) {
    if (a.position.x >= b.position.x || a.position.x <= b.position.x + b.size.x) {
        a.position.x -= (a.position.x - b.position.x);
    }
    if (a.position.y >= b.position.y || a.position.y <= b.position.y + b.size.y) {
        a.position.y -= (a.position.y - b.position.y);
    }
    if (a.position.z >= b.position.z || a.position.z <= b.position.z + b.size.z) {
        a.position.z -= (a.position.z - b.position.z);
    }
}

export function BoxTerrainSolver(a: PhysicsObject, b: Terrain) {
    const terrainBounds = b.getBoundingBox(a.boundingBox);
    BoxBoxSolver(a.boundingBox, terrainBounds);
}