import { Actor } from './actor';
import { MovePayload, AnglePayload } from '../types/actionType';
import { Robots } from '../setup/constants';
import { Assets } from '../res/assets';
import { URDFRobot, URDFJoint } from 'urdf-loader';

export class OpticalTable extends Actor {
    table!: URDFRobot;
    slideJoint!: URDFJoint; // range [-3.5, 0]
    targetAngle: Number;

    constructor() {
        let table = Assets.getInstance().getRobots().get(Robots.OpticalTable)!;
        super(table);
        this.table = table;
        this.slideJoint = table.joints["slide-j"];
        this.targetAngle = this.slideJoint.angle;
    }

    getCurrentAngle(): Number {
        return this.slideJoint.angle;
    }

    handleMove(_: MovePayload): void {
    }

    handleBaseMove(payload: AnglePayload): void {
        this.targetAngle = payload.angle;
    }

    update(delta: number): void {
        const speed = 1.0;
        const currentAngle = this.getCurrentAngle() as number;
        const angleDifference = this.targetAngle as number - currentAngle;
        const step = Math.sign(angleDifference) * Math.min(Math.abs(angleDifference), speed * delta);
        this.slideJoint.setJointValue(currentAngle + step);
        if (Math.abs(angleDifference) < 0.01) {
            this.slideJoint.setJointValue(this.targetAngle as number);
        }
    }
}


