import { Robots } from '../setup/constants';
import { Assets } from '../res/assets';
import { URDFRobot, URDFJoint } from 'urdf-loader';
import { ArmStateMachine, ArmCommand, ArmState } from './armState';
import * as THREE from 'three';

export class ArmController {
    table: URDFRobot;
    slideJoint: URDFJoint; // range [-3.5, 0]
    armFSM: ArmStateMachine;

    constructor() {
        let table = Assets.getInstance().getRobots().get(Robots.OpticalTable)!;
        this.table = table;
        this.slideJoint = table.joints["slide-j"];
        this.armFSM = new ArmStateMachine();
    }

    public getObject(): THREE.Object3D {
        return this.table;
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
