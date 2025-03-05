import { URDFRobot, URDFJoint } from 'urdf-loader';
import { ArmStateMachine } from '../entity/armState';
import { ArmState, ArmCommand } from '../setup/enums';
import { OpticsController } from './opticsController';
import * as THREE from 'three';
import { SelectBox } from '../entity/selectBox';
import { Entity } from '../entity/entity';

function createOpticsControllers(table: Entity): OpticsController[] {
    return Array.from({ length: 10 }, (_, i) =>
        new OpticsController(table.bubbles[i], table.selectBoxes[i], i)
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
    armFSM: ArmStateMachine;
    opticsControllers: OpticsController[];
    arm: Entity;
    table: Entity;

    constructor(table: Entity, arm: Entity) {
        this.table = table;
        this.arm = arm;
        this.opticsControllers = createOpticsControllers(table);
        this.armFSM = new ArmStateMachine();
        this.setArmPosition();
    }

    public getArmState(): ArmState {
        return this.armFSM.getState();
    }

    public handleArmCommand(newCommand: ArmCommand): void {
        this.armFSM.transition(newCommand);
    }

    private getTargetAngle(): number {
        return this.armFSM.getTargetAngle();
    }

    public getOpticalControllers(): OpticsController[] {
        return this.opticsControllers;
    }

    public getOpticsControllerBySelectBox(selectBox: SelectBox): OpticsController | undefined {
        return this.opticsControllers.find(controller => controller.selectBox === selectBox);
    }

    private setArmPosition(): void {
        const offset = new THREE.Vector3(-0.087, 0.0777, -0.01345);
        this.arm.object.position.copy(getSlidePosition(this.table).clone()).add(offset);
    }

    private setSlidePosition(dt: number): void {
        const speed = 1.0;
        const angle = getSlideAngle(this.table);
        const angleDifference = this.getTargetAngle() - angle;
        const step = Math.sign(angleDifference) * Math.min(Math.abs(angleDifference), speed * dt);
        const slideJoint = getSlideJoint(this.table);
        slideJoint.setJointValue(angle + step);
        if (Math.abs(angleDifference) < 0.01) {
            slideJoint.setJointValue(this.getTargetAngle());
        }
    }

    update(dt: number): void {
        if (this.armFSM.getState() == ArmState.Idle) {
            return;
        }
        this.setSlidePosition(dt);
        this.setArmPosition();
    }
}
