import { URDFRobot, URDFJoint } from 'urdf-loader';
import { ArmStateMachine } from '../entity/armState';
import { ArmState, ArmCommand } from '../setup/enums';
import { OpticsUnit } from '../entity/opticsUnit';
import * as THREE from 'three';
import { SelectBox } from '../entity/selectBox';
import { Entity } from '../entity/entity';

function createOpticsUnits(table: Entity): OpticsUnit[] {
    return Array.from({ length: 10 }, (_, i) =>
        new OpticsUnit(table.bubbles[i], table.selectBoxes[i], i)
    );
}

function getSlideJoint(table: Entity): URDFJoint {
    const tableRobot = table.object as URDFRobot;
    return tableRobot.joints["slide-j"]; // range [-3.5, 0]
}

function getSlideAngle(table: Entity): number {
    return getSlideJoint(table).angle as number;
}

function getSlidePosition(table: Entity): THREE.Vector3 {
    const position = new THREE.Vector3();
    getSlideJoint(table).getWorldPosition(position);
    return position;
}

export class TableController {
    private static readonly SLIDE_SPEED = 1.0;
    private armFSM: ArmStateMachine;
    private opticsUnitss: OpticsUnit[];
    private arm: Entity;
    private table: Entity;

    constructor(table: Entity, arm: Entity) {
        this.table = table;
        this.arm = arm;
        this.opticsUnitss = createOpticsUnits(table);
        this.armFSM = new ArmStateMachine();
        this.setArmPosition();
    }

    public getArmState(): ArmState {
        return this.armFSM.getState();
    }

    public handleArmCommand(newCommand: ArmCommand): void {
        if (newCommand != ArmCommand.SYNC && newCommand != ArmCommand.SYNC_REAL) {
            this.armFSM.transition(newCommand);
        }
    }

    public getOpticsUnits(): OpticsUnit[] {
        return this.opticsUnitss;
    }

    public getOpticsUnitBySelectBox(selectBox: SelectBox): OpticsUnit | undefined {
        return this.opticsUnitss.find(unit => unit.selectBox === selectBox);
    }

    public setArmBasePositionScaled(scaledPosition: number): void {
        const slideJoint: URDFJoint = getSlideJoint(this.table);
        slideJoint.setJointValue(scaledPosition);
        this.setArmPosition();
        this.armFSM.transition(ArmCommand.STOP);
    }

    private setArmPosition(): void {
        this.arm.object.position.copy(this.getArmBasePosition2());
    }

    public getArmBasePosition2(): THREE.Vector3 {
        const offset = new THREE.Vector3(-0.087, 0.0777, -0.01345);
        return getSlidePosition(this.table).clone().add(offset);
    }

    public getArmBasePosition(): THREE.Vector3 {
        return getSlidePosition(this.table).clone();
    }

    private getSlideTargetPosition(dt: number): number {
        const currentAngle = getSlideAngle(this.table);
        const targetAngle = this.armFSM.getTargetAngle();
        const angleDifference = targetAngle - currentAngle;
        if (Math.abs(angleDifference) < 0.01) return targetAngle;
        return currentAngle + Math.sign(angleDifference) * Math.min(Math.abs(angleDifference), TableController.SLIDE_SPEED * dt);
    }

    private setSlidePosition(dt: number): void {
        const slideJoint: URDFJoint = getSlideJoint(this.table);
        slideJoint.setJointValue(this.getSlideTargetPosition(dt));
    }

    update(dt: number): void {
        if (this.armFSM.getState() == ArmState.Idle) {
            return;
        }
        this.setSlidePosition(dt);
        this.setArmPosition();
    }
}
