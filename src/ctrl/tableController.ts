import { URDFRobot, URDFJoint } from 'urdf-loader';
import { ArmStateMachine } from '../entity/armState';
import { ArmState, ArmCommand } from '../setup/enums';
import { OpticsController } from './opticsController';
import * as THREE from 'three';
import { Bubble } from '../entity/bubble';
import { SelectBox } from '../entity/selectBox';

export class TableController {
    table: URDFRobot;
    slideJoint: URDFJoint; // range [-3.5, 0]
    armFSM: ArmStateMachine;
    opticsControllers: OpticsController[];

    constructor(table: URDFRobot, bubbles: Bubble[], selBoxes: SelectBox[]) {

        const numOptics = 10;
        if (bubbles.length !== numOptics) {
            throw new Error(`Expected exactly ${numOptics} speech buubles.`);
        }
        if (selBoxes.length !== numOptics) {
            throw new Error(`Expected exactly ${numOptics} selection boxes.`);
        }

        this.table = table;
        table.updateMatrixWorld(true);
        this.slideJoint = table.joints["slide-j"];
        this.armFSM = new ArmStateMachine();
        this.opticsControllers = [];
        for (let i = 0; i < 10; i++) {
            const pos = new THREE.Vector3(-1.3 + i * 0.57, 1.5, -0.5);
            if (i > 4) {
                pos.x -= 5 * 0.57;
                pos.z = 0.5;
            }
            let opticsController = new OpticsController(bubbles[i], pos, selBoxes[i], i);
            this.opticsControllers.push(opticsController);
        }
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
