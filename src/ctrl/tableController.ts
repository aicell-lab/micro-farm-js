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
    private static readonly SLIDE_SPEED = 1.0;
    private armFSM: ArmStateMachine;
    private opticsControllers: OpticsController[];
    private arm: Entity;
    private table: Entity;

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
        if (newCommand != ArmCommand.SYNC) {
            this.armFSM.transition(newCommand);
        }
    }

    public getOpticalControllers(): OpticsController[] {
        return this.opticsControllers;
    }

    public getOpticsControllerBySelectBox(selectBox: SelectBox): OpticsController | undefined {
        return this.opticsControllers.find(controller => controller.selectBox === selectBox);
    }

    private setArmPosition(): void {
        this.arm.object.position.copy(this.getArmBasePosition2())
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
