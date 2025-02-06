import { URDFRobot, URDFJoint } from 'urdf-loader';
import { ArmStateMachine } from './armState';
import { ArmState, ArmCommand } from '../setup/enums';

export class ArmController {
    table: URDFRobot;
    slideJoint: URDFJoint; // range [-3.5, 0]
    armFSM: ArmStateMachine;

    constructor(table: URDFRobot) {
        this.table = table;
        this.slideJoint = table.joints["slide-j"];
        this.armFSM = new ArmStateMachine();
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
