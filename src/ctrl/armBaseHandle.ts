import { URDFJoint } from 'urdf-loader';
import * as THREE from 'three';
import { Entity } from '../entity/entity';
import { EntityCollection } from '../setup/entityCollection';
import { getSlideJoint, getSlidePosition } from './sliderUtils';

export class ArmBaseHandle {
    private table: Entity;
    private arm: Entity;

    constructor(entities: EntityCollection) {
        this.table = entities.getActors().table;
        this.arm = entities.getActors().arm;
        this.setArmPosition();
    }

    public setArmBasePositionScaled(scaledPosition: number): void {
        const slideJoint: URDFJoint = getSlideJoint(this.table);
        slideJoint.setJointValue(scaledPosition);
        this.setArmPosition();
    }

    public setArmPosition(): void {
        this.arm.object.position.copy(this.getArmBasePosition());
    }

    private getBaseOffset(): THREE.Vector3 {
        return new THREE.Vector3(-0.087, 0.0777, -0.01345);
    }

    private getArmBasePosition(): THREE.Vector3 {
        return getSlidePosition(this.table).clone().add(this.getBaseOffset());
    }
}
