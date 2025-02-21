import { URDFRobot, URDFJoint } from 'urdf-loader';
import { ArmStateMachine } from '../entity/armState';
import { ArmState, ArmCommand } from '../setup/enums';
import { OpticsController } from './opticsController';
import * as THREE from 'three';
import { Bubble } from '../entity/bubble';

export class TableController {
    table: URDFRobot;
    slideJoint: URDFJoint; // range [-3.5, 0]
    armFSM: ArmStateMachine;
    opticsController: OpticsController;

    constructor(table: URDFRobot, bubbles: Bubble[]) {

        const numOptics = 1;
        if (bubbles.length !== numOptics) {
            throw new Error(`Expected exactly ${numOptics} meshes.`);
        }

        this.table = table;
        table.updateMatrixWorld(true);
        this.slideJoint = table.joints["slide-j"];
        //console.log(`joint: ${this.slideJoint.limit.lower}`);
        let squid = this.table.links["squid"];
        this.armFSM = new ArmStateMachine();
        this.opticsController = new OpticsController(squid, bubbles[0]);
    }

    adjustBubblePositions(): void {
        let pos = new THREE.Vector3();
        this.table.getWorldPosition(pos);
        console.log(pos);

        this.opticsController.adjustBubblePosition();
    }

    public createStatusBubbles(): THREE.Mesh[] {
        let bubbles: THREE.Mesh[] = [];

        return bubbles;
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
