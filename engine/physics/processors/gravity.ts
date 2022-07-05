import vec3 from "../../math/vec3";
import { World } from "../world";

export class GravityProcessor {
    private dt: number;
    private grav: vec3;
    public constructor() {
        this.dt = 0;
        this.grav = new vec3([0, 0, 0]);
    }

    public execute(world: World) {
        this.dt = this.dt;
        this.grav.x = world.gravity.x * this.dt;
        this.grav.y = world.gravity.y * this.dt;
        this.grav.z = world.gravity.z * this.dt;
        let objects = world.objects;
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].affectedByGravity) {
                objects[i].velocity.add(this.grav);
            }
        }
    }
}