import { BoxBoxSolver, BoxTerrainSolver } from "./collision/solver";
import { PhysicsObject } from "./object";
import { ObjectType } from "./object-type";
import { Terrain } from "./terrain";
import { World } from "./world";

export class Narrowphase {
    public constructor(
        private world: World,
    ) {

    }

    public perform(objs: Array<Array<PhysicsObject>>) {
        for (let x = 0; x < objs.length; x++) {
            for (let i = 0; i < objs[x].length; i++) {
                for (let j = 0; j < objs[x].length; j++) {
                    if (objs[x][i] === objs[x][j]) continue;
                    if (objs[x][i].collidesWith(objs[x][j])) {
                        this.world.collisionMatrix.add(objs[x][i], objs[x][j]);
                        if (objs[x][i].type === ObjectType.object) {
                            if (objs[x][j].type == ObjectType.object) {
                                BoxBoxSolver(objs[x][i].boundingBox, objs[x][j].boundingBox);
                            } else {
                                BoxTerrainSolver(objs[x][i], objs[x][j] as Terrain);
                            }
                        }
                    }
                }
            }
        }
    }
}