import Box from "../math/box";
import { PhysicsObject } from "./object";
import { Octree } from "./octree";
import { World } from "./world";

export class Broadphase {
    public constructor(
        private world: World
    ) {
    }

    public execute(): Array<Array<PhysicsObject>> {
        let pairs = [];
        let objs = this.world.objects;
        for (let i = 0; i < objs.length; i++) {
            let candidates = this.world.octree.find(objs[i].boundingBox);
            if (candidates.length === 0) continue;
            let o = [];
            o.push(objs[i]);
            for (let j = 0; j < candidates.length; j++) {
                if (objs[i] === candidates[j]) continue;
                o.push(candidates[j]);
            }
            if (o.length > 1) {
                pairs.push(o);
            }
        }
        return pairs;
    }
}