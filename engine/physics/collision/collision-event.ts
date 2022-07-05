import { PhysicsObject } from "../object";

export class CollisionEvent {
    public bodyA: PhysicsObject;
    public bodyB: PhysicsObject;
    public constructor(a: PhysicsObject, b: PhysicsObject) {
        this.bodyA = a;
        this.bodyB = b;
    }

    public equals(ev: CollisionEvent): boolean {
        return (this.bodyA === ev.bodyA && this.bodyB === ev.bodyB);
    }
}