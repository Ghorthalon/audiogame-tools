import Box from "./box";
import vec3 from "./vec3";

export default class Ray {
    public origin: vec3;
    public direction: vec3;
    public constructor(origin: vec3, direction: vec3) {
        this.origin = origin;
        this.direction = direction;
    }

    public intersects(box: Box) {
        // ray.direction is unit direction vector of ray
        const dirFracX = 1 / this.direction.x;
        const dirFracY = 1 / this.direction.y;
        const dirFracZ = 1 / this.direction.z;

        // this.position is the corner of AABB with minimal coordinates - left bottom, rt is maximal corner
        const t1 = (box.position.x - this.origin.x) * dirFracX;
        const t2 = (box.upperBound.x - this.origin.x) * dirFracX;
        const t3 = (box.position.y - this.origin.y) * dirFracY;
        const t4 = (box.upperBound.y - this.origin.y) * dirFracY;
        const t5 = (box.position.z - this.origin.z) * dirFracZ;
        const t6 = (box.upperBound.z - this.origin.z) * dirFracZ;


        const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
        const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));

        // if tmax < 0, ray is intersecting AABB, but whole AABB is behind us
        if (tmax < 0) {
            return false;
        }

        // if tmin > tmax, ray doesn't intersect AABB
        if (tmin > tmax) {
            return false;
        }

        // yay! We're about to run into a thing!
        return true;
    }   
}