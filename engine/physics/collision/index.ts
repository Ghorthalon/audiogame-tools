import { PhysicsObject } from "../object";
import { World } from "../world";
import { CollisionEvent } from "./collision-event";

export class CollisionMatrix {
    public collisions: Array<CollisionEvent>;
    public constructor(
        private world: World
    ) {
        this.collisions = [];
    }

    public add(a: PhysicsObject, b: PhysicsObject) {
        this.collisions.push(new CollisionEvent(a, b));
    }

    public remove(a: PhysicsObject, b: PhysicsObject) {
        for (let i = 0; i < this.collisions.length; i++) {
            if (this.collisions[i].bodyA == a && this.collisions[i].bodyB == b) {
                this.collisions.slice(i, 1);
                return;
            }
        }
    }

    public contains(ev: CollisionEvent): boolean {
        for (let i = 0; i < this.collisions.length;i++) {
            if (this.collisions[i].equals(ev)) return true;
        }
        return false;
    }

    public length(): number {
        return this.collisions.length;
    }

    public getIndex(i: number): CollisionEvent {
        if (i >= this.collisions.length) return null;
        return this.collisions[i];
    }

    public clear() {
        this.collisions = [];
    }
}