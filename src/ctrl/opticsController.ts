import * as THREE from 'three';
import { OpticsState } from '../setup/enums';
import { Bubble } from '../entity/bubble';

export class OpticsController {
    bubble: Bubble;
    state: OpticsState = OpticsState.STANDBY;
    pos: THREE.Vector3;

    constructor(bubble: Bubble, position: THREE.Vector3) {
        this.bubble = bubble;
        this.pos = position;
        bubble.setPosition(position);
    }

    update(_dt: number): void {
    }

}

