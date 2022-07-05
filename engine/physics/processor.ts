import { World } from "./world";

export interface Processor {
    execute(world: World);
}