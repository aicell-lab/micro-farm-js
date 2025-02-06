import { Actor, createDefaultActorMesh } from './actor';
import { PlayerController } from './playerController';

export class Human extends Actor {

    constructor() {
        super(createDefaultActorMesh());
        this.playerController = new PlayerController();
    }

    update(delta: number): void {
        this.playerController?.update(this.object, delta);
    }
}


