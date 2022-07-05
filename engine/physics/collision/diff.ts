import { CollisionMatrix } from ".";
import { World } from "../world";

export class CollisionDiff {
    public prevMatrix: CollisionMatrix;
    public currMatrix: CollisionMatrix;
    public constructor(
        private world: World
    ) {
        this.prevMatrix = new CollisionMatrix(world);
        this.currMatrix = new CollisionMatrix(world);
    }

    public perform() {
        let added = [];
        let removed = [];
        if (this.prevMatrix.length() === 0 && this.currMatrix.length() === 0) {
            return;
        }
        if (this.prevMatrix.length() === 0) {
            added.push([...this.currMatrix.collisions]);
        } else if (this.currMatrix.length() === 0) {
            removed.push([...this.prevMatrix.collisions]);
        } else {
            for (let i = 0; i < this.currMatrix.length(); i++) {
                if (this.currMatrix.getIndex(i).equals(this.prevMatrix.getIndex(i))) {
                    continue;
                }
                if (!this.currMatrix.contains(this.prevMatrix.getIndex(i))) {
                    removed.push(this.prevMatrix.getIndex(i));
                }
                if (!this.prevMatrix.contains(this.currMatrix.getIndex(i))) {
                    added.push(this.currMatrix.getIndex(i));
                }
            }
        }

        
        for (let i = 0; i < added.length; i++) {
            this.world.emit("collision.enter", added[i]);
        }
        for (let i = 0; i < removed.length; i++) {
            this.world.emit("collision.exit", removed[i]);
        }
        this.prevMatrix = this.currMatrix;
    }
}