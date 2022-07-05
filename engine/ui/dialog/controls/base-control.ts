import { EventBus } from "../../../event-bus";

export class BaseControl extends EventBus {
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