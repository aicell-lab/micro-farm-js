import { Actor } from "../system/actor";

export interface Action {
    execute(actor: Actor): void;
}

export class MoveAction implements Action {
    private direction: { forward: boolean; backward: boolean; left: boolean; right: boolean };

    constructor(direction: { forward: boolean; backward: boolean; left: boolean; right: boolean }) {
        this.direction = direction;
    }

    execute(actor: Actor): void {
        const acc = 10;
        if (this.direction.forward) actor.acceleration.z = -acc;
        else if (this.direction.backward) actor.acceleration.z = acc;
        else actor.acceleration.z = 0;

        if (this.direction.left) actor.acceleration.x = -acc;
        else if (this.direction.right) actor.acceleration.x = acc;
        else actor.acceleration.x = 0;
    }
}




