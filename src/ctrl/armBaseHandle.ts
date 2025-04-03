import { URDFRobot, URDFJoint } from 'urdf-loader';
import * as THREE from 'three';
import { Entity } from '../entity/entity';

function getSlideJoint(table: Entity): URDFJoint {
    const tableRobot = table.object as URDFRobot;
    return tableRobot.joints["slide-j"]; // range [-3.5, 0]
}

function getSlidePosition(table: Entity): THREE.Vector3 {
    const position = new THREE.Vector3();
    getSlideJoint(table).getWorldPosition(position);
    return position;
}

export class ArmBaseHandle {
    private table: Entity;
    private arm: Entity;

    constructor(table: Entity, arm: Entity) {
        this.table = table;
        this.arm = arm;
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
