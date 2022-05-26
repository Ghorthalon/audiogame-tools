import { BaseControl } from "./controls/base-control";

export class ControlContainer {
    private controls: BaseControl[];
    public constructor(
        controls: BaseControl[]
    ) {
        this.controls = controls;
    }

    public init(): void {

    }

    public show(): void {
        
    }

    public hide(): void {

    }
}