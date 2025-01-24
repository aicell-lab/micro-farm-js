import { MovePayload } from '../types/actionType';
import { Actor, createDefaultActorMesh } from './actor';

export class Human extends Actor {

    constructor() {
        super(createDefaultActorMesh());
    }

    handleMove(p: MovePayload): void {
        const acc = 10;
        if (p.forward) this.acceleration.z = -acc;
        else if (p.backward) this.acceleration.z = acc;
        else this.acceleration.z = 0;

        if (p.left) this.acceleration.x = -acc;
        else if (p.right) this.acceleration.x = acc;
        else this.acceleration.x = 0;
    }

    update(delta: number): void {
        this.updatePosition(delta);
    }
}


