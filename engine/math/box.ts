import Vec3 from "./vec3";

export default class Box {
  public position: Vec3;
  public size: Vec3;
  public constructor(position: Vec3, size: Vec3) {
    this.position = position;
    this.size = size;
  }

  public center(): Vec3 {
    return new Vec3([
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2,
      this.position.z + this.size.z / 2,
    ]);
  }

  get upperBound(): Vec3 {
    return new Vec3([
      this.position.x + this.size.x,
      this.position.y + this.size.y,
      this.position.z + this.size.z,
    ]);
  }

  public contains(box: Box): boolean {
    return (
      (box.position.x >= this.position.x &&
        box.position.x <= this.position.x + this.size.x &&
        box.position.y >= this.position.y &&
        box.position.y <= this.position.y + this.size.y &&
        box.position.z >= this.position.z &&
        box.position.z <= this.position.z + this.size.z) &&
      (box.position.x + box.size.x >= this.position.x &&
        box.position.x + box.size.x <= this.position.x + this.size.x &&
        box.position.y + box.size.y >= this.position.y &&
        box.position.y + box.size.y <= this.position.y + this.size.y &&
        box.position.z + box.size.z >= this.position.z &&
        box.position.z + box.size.z <= this.position.z + this.size.z)
    );
  }

  public overlaps(box: Box): boolean {
    return this.position.x <= box.position.x + box.size.x &&
      this.position.x + this.size.x >= box.position.x &&
      this.position.y <= box.position.y + box.size.y &&
      this.position.y + this.size.y >= box.position.y &&
      this.position.z <= box.position.z + box.size.z &&
      this.position.z + this.size.z >= box.position.z;
  }

  public containsPoint(x: number, y: number, z: number) {
    return (
      x >= this.position.x && x <= this.position.x + this.size.x &&
      y >= this.position.y && y <= this.position.y + this.size.y &&
      z >= this.position.z && z <= this.position.z + this.size.z
    );
  }
}
