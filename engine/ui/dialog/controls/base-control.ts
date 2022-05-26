import { EventEmitter } from "eventemitter3";

export class BaseControl extends EventEmitter {
    public constructor() {
        super();
    }

    public show(): void {
        return;
    }

    public hide(): void {
        return;
    }

    public init() {
        return;
    }

    public attach(): void {
        return;
    }

    public detach(): void {
        return;
    }

    public getState(): void {
        return;
    }
}