// The code that deals with 3d audio

import ResonatorAudioContext from "../audio-context";
import { EventBus } from "../../event-bus";
import vec3 from "../../math/vec3";

export default class ResonatorScene extends EventBus {
  scene: GainNode;
  context: ResonatorAudioContext;
  listener: AudioListener;
  position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  orientation: any;
  isFirefox: boolean = false;
  constructor(context: ResonatorAudioContext) {
    super();
    this.context = context;
    this.scene = this.context.getContext().createGain();
    this.listener = this.context.getContext().listener;
    this.position = { x: 0, y: 0, z: 0 };
    this.orientation = {
      up: { x: 0, y: 1, z: 0 },
      fwd: { x: 0, y: 0, z: -1 },
    };
    this.checkIfFirefox();
    this.init();
  }

  init(): void {
    // this.scene.output.connect(this.context.getOutputDestination());
  }

  createSource(): any {
    const node = this.context.getContext().createPanner();
    node.panningModel = "HRTF";
    node.distanceModel = "linear";
    node.maxDistance = 20;
    node.refDistance = 2;
    node.connect(this.scene);
    return node;
  }

  getOutput(): any {
    return this.scene;
  }

  getInput(): any {
    return this.scene;
  }

  setListenerPosition(x: number, y: number, z: number): void {
    if (
      x === this.position.x && y === this.position.y && z == this.position.z
    ) return;

    if (this.isFirefox) {
      this.listener.setPosition(x, y, z);
    } else {
      this.listener.positionX.setValueAtTime(
        x,
        this.context.getContext().currentTime,
      );
      this.listener.positionY.setValueAtTime(
        y,
        this.context.getContext().currentTime,
      );
      this.listener.positionZ.setValueAtTime(
        z,
        this.context.getContext().currentTime,
      );
    }

    this.position = { x, y, z };
  }

  setListenerOrientation(forward: any, rawup: any) {
    let fwd = new vec3([forward.x, forward.y, forward.z]);
    let up = fwd.copy();

    vec3.cross(up, new vec3([rawup.x, rawup.y, rawup.z]), up);
    vec3.cross(up, fwd, up);
    fwd.normalize();
    up.normalize();

    if (
      fwd.x === this.orientation.fwd.x && fwd.y === this.orientation.fwd.y &&
      fwd.z === this.orientation.fwd.z && up.x === this.orientation.up.x &&
      up.y === this.orientation.up.y && up.z === this.orientation.up.z
    ) return;
    // this.listener.setOrientation(fwd.x, fwd.y, fwd.z, up.x, up.y, up.z);
    if (this.isFirefox) {
      this.listener.setOrientation(fwd.x, fwd.y, fwd.z, up.x, up.y, up.z);
    } else {
      this.listener.forwardX.setValueAtTime(
        fwd.x,
        this.context.getContext().currentTime,
      );
      this.listener.forwardY.setValueAtTime(
        fwd.y,
        this.context.getContext().currentTime,
      );
      this.listener.forwardZ.setValueAtTime(
        fwd.z,
        this.context.getContext().currentTime,
      );
      this.listener.upX.setValueAtTime(
        up.x,
        this.context.getContext().currentTime,
      );
      this.listener.upY.setValueAtTime(
        up.y,
        this.context.getContext().currentTime,
      );
      this.listener.upZ.setValueAtTime(
        up.z,
        this.context.getContext().currentTime,
      );
    }

    this.orientation = { fwd, up };
  }

  private checkIfFirefox() {
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  }
}
