import * as THREE from 'three';
import { OpticsState } from '../setup/enums';
import { Bubble } from './bubble';
import { SelectBox } from './selectBox';
import { Entity } from './entity';

function getOpticsUnitPosition(index: number): THREE.Vector3 {
    let pos = new THREE.Vector3(-1.3 + index * 0.57, 1.5, -0.5);
    if (index > 4) {
        pos.x -= 5 * 0.57;
        pos.z = 0.5;
    }
    return pos;
}

function setPositions(index: number, bubble: Bubble, selectBox: SelectBox): void {
    const position = getOpticsUnitPosition(index);
    bubble.setPosition(position);
    position.y -= 0.4;
    selectBox.setPosition(position);
}

export class OpticsUnit {
    bubble: Bubble;
    selectBox: SelectBox
    id: number;
    state: OpticsState = OpticsState.STANDBY;

    constructor(bubble: Bubble, selectBox: SelectBox, id: number) {
        this.bubble = bubble;
        this.selectBox = selectBox;
        this.id = id;
        setPositions(id, bubble, selectBox);
        selectBox.setVisible(false);
    }

    public update(_dt: number): void {
    }

    public getDistance(entity: Entity): THREE.Vector3 {
        const position = getOpticsUnitPosition(this.id);
        return entity.object.position.clone().sub(position);
    }

    public getDistanceScalar(entity: Entity): number {
        return this.getDistance(entity).length();
    }

    public getID(): number {
        return this.id;
    }

}

