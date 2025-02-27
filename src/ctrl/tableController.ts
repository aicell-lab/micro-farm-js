import { URDFRobot, URDFJoint } from 'urdf-loader';
import { ArmStateMachine } from '../entity/armState';
import { ArmState, ArmCommand } from '../setup/enums';
import { OpticsController } from './opticsController';
import * as THREE from 'three';
//import { Bubble } from '../entity/bubble';
import { SelectBox } from '../entity/selectBox';
import { Entity } from '../entity/entity';

export class TableController {
    slideJoint: URDFJoint; // range [-3.5, 0]
    armFSM: ArmStateMachine;
    opticsControllers: OpticsController[];
    arm: Entity;


    private checkTable(table: Entity): void {
        const numOptics = 10;
        if (table.bubbles.length !== numOptics) {
            throw new Error(`Expected exactly ${numOptics} speech buubles.`);
        }
        if (table.selectBoxes.length !== numOptics) {
            throw new Error(`Expected exactly ${numOptics} selection boxes.`);
        }
    }

    private createOpticsControllers(table: Entity): OpticsController[] {
        let controllers: OpticsController[] = [];
        for (let i = 0; i < 10; i++) {
            const pos = new THREE.Vector3(-1.3 + i * 0.57, 1.5, -0.5);
            if (i > 4) {
                pos.x -= 5 * 0.57;
                pos.z = 0.5;
            }
            let opticsController = new OpticsController(table.bubbles[i], pos, table.selectBoxes[i], i);
            controllers.push(opticsController);
        }
        return controllers;
    }

    constructor(table: Entity, arm: Entity) {
        this.arm = arm;
        this.checkTable(table);
        const tableRobot = table.object as URDFRobot;
        this.slideJoint = tableRobot.joints["slide-j"];
        this.armFSM = new ArmStateMachine();
        this.opticsControllers = this.createOpticsControllers(table);
    }

    getCurrentAngle(): number {
        return this.slideJoint.angle as number;
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

    update(delta: number): void {

        let slidePos = new THREE.Vector3();
        this.slideJoint.getWorldPosition(slidePos);
        this.arm.object.position.copy(slidePos.clone());

        if (this.armFSM.getState() == ArmState.Idle) {
            return;
        }

        const speed = 1.0;
        const currentAngle = this.getCurrentAngle();
        const angleDifference = this.getTargetAngle() - currentAngle;
        const step = Math.sign(angleDifference) * Math.min(Math.abs(angleDifference), speed * delta);
        this.slideJoint.setJointValue(currentAngle + step);
        if (Math.abs(angleDifference) < 0.01) {
            this.slideJoint.setJointValue(this.getTargetAngle());
        }
    }
}
