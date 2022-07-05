import { EventBus } from '../../event-bus';
import { SoundManager } from "./sound-manager";
import { ControlContainer } from "./control-container";
import { BaseControl } from "./controls/base-control";
import { SoundSet } from "./interfaces/sound-set";
import { KeyManager } from "./key-manager";

export class Dialog extends EventBus {
    public running: boolean;
    private containers: ControlContainer[];
    private target: HTMLElement;
    private focused: BaseControl;
    private soundSet: SoundSet;
    private soundManager: SoundManager;
    private keyManager: KeyManager;
    private title: string;

    public constructor(title: string, soundSet: SoundSet) {
        super();
        this.title = title;
        this.keyManager = new KeyManager(this);
        this.soundManager = new SoundManager(this);

    }

    async run(target: HTMLElement): Promise<any> {
        
    }
}