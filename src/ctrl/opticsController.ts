import * as THREE from 'three';
import { OpticsState } from '../setup/enums';
import { Bubble } from '../entity/bubble';
import { SelectBox } from '../entity/selectBox';

export class OpticsController {
    bubble: Bubble;
    state: OpticsState = OpticsState.STANDBY;
    pos: THREE.Vector3;
    selectBox: SelectBox

    constructor(bubble: Bubble, position: THREE.Vector3, selectBox: SelectBox) {
        this.bubble = bubble;
        this.pos = position;
        this.selectBox = selectBox;
        bubble.setPosition(position);
        position.y -= 0.4;
        selectBox.setPosition(position);
        //selectBox.setVisible(false);
    }

    update(_dt: number): void {
    }

}

