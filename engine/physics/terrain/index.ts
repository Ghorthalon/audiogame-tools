import Box from "../../math/box";
import vec3 from "../../math/vec3";
import { PhysicsObject } from "../object";
import { ObjectType } from "../object-type";

export class Terrain extends PhysicsObject {
  public heightmap: Uint8Array;
  public texturemap: Uint8Array;
  public constructor() {
    super();
    this.type = ObjectType.terrain;
    this.heightmap = new Uint8Array();
    this.texturemap = new Uint8Array();
  }

  public setTextureMap(tmap: Uint8Array) {
    this.texturemap = tmap;
  }

  public setHeightMap(hmap: Uint8Array) {
    this.heightmap = hmap;
  }

  public getHeightAt(x: number, z: number): number {
    const localX = Math.floor(x - this.boundingBox.position.x);
    const localZ = Math.floor(z - this.boundingBox.position.z);
    const width = Math.floor(this.boundingBox.size.x);
    return this.heightmap[localX * width + localZ];
  }

  public getTextureAt(x: number, z: number): number {
    const localX = Math.floor(x - this.boundingBox.position.x);
    const localZ = Math.floor(z - this.boundingBox.position.z);
    const width = Math.floor(this.boundingBox.size.x);
    return this.heightmap[localX * width + localZ];
  }

  public getBoundingBox(bounds: Box): Box {
    const halfWidth = bounds.size.x / 2;
    const halfDepth = bounds.size.z / 2;
    const ax = bounds.position.x + halfWidth;
    const az = bounds.position.z;
    const bx = bounds.position.x;
    const bz = bounds.position.z + halfDepth;
    const cx = ax;
    const cz = bounds.position.z + bounds.size.z;
    const dx = bounds.position.x + bounds.size.x;
    const dz = bounds.position.z + halfDepth;
    const heights = [
      this.getHeightAt(ax, az),
      this.getHeightAt(bx, bz),
      this.getHeightAt(cx, cz),
      this.getHeightAt(dx, dz),
    ];
    const boxSize = new vec3([
      bounds.size.x,
      Math.max(...heights),
      bounds.size.z,
    ]);
    const boxPos = new vec3([
      bounds.position.x,
      this.boundingBox.position.y + Math.min(...heights),
      bounds.position.z,
    ]);
    const box = new Box(boxPos, boxSize);
    return box;
  }
  
  public collidesWith(obj: PhysicsObject): boolean {
    if (!this.boundingBox.overlaps(obj.boundingBox)) {
      return false;
    }
    const halfWidth = obj.boundingBox.size.x / 2;
    const halfDepth = obj.boundingBox.size.z / 2;
    const ax = obj.boundingBox.position.x + halfWidth;
    const az = obj.boundingBox.position.z;
    const bx = obj.boundingBox.position.x;
    const bz = obj.boundingBox.position.z + halfDepth;
    const cx = ax;
    const cz = obj.boundingBox.position.z + obj.boundingBox.size.z;
    const dx = obj.boundingBox.position.x + obj.boundingBox.size.x;
    const dz = obj.boundingBox.position.z + halfDepth;
    const heights = [
      this.getHeightAt(ax, az),
      this.getHeightAt(bx, bz),
      this.getHeightAt(cx, cz),
      this.getHeightAt(dx, dz),
    ];
    const boxSize = new vec3([
      obj.boundingBox.size.x,
      Math.max(...heights),
      obj.boundingBox.size.z,
    ]);
    const boxPos = new vec3([
      obj.boundingBox.position.x,
      this.boundingBox.position.y + Math.min(...heights),
      obj.boundingBox.position.z,
    ]);
    const box = new Box(boxPos, boxSize);
    return box.overlaps(obj.boundingBox);
  }

  public onCollision(obj: PhysicsObject): boolean {
    if (obj.type === ObjectType.terrain) return;
    // obj.boundingBox.position.y = this.boundingBox.position.y + this.getHeightAt(obj.boundingBox.position.x, obj.boundingBox.position.z);
    return true;
  }
}
