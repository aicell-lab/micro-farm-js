import * as THREE from 'three';
import { OpticsState } from '../setup/enums';
import { Bubble } from '../entity/bubble';
import { SelectBox } from '../entity/selectBox';
import { Entity } from '../entity/entity';

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
        selectBox.setVisible(false);
    }

    update(_dt: number): void {
    }

    public getDistance(entity: Entity): THREE.Vector3 {
        return entity.object.position.clone().sub(this.pos);
    }

    public getDistanceScalar(entity: Entity): number {
        return this.getDistance(entity).length();
    }


}

