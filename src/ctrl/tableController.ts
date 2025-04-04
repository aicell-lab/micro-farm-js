import { URDFRobot, URDFJoint } from 'urdf-loader';
import { ArmStateMachine } from '../entity/armState';
import { ArmState, ArmCommand } from '../setup/enums';
import { OpticsUnit } from '../entity/opticsUnit';
import { SelectBox } from '../entity/selectBox';
import { Entity } from '../entity/entity';
import { ArmBaseHandle } from './armBaseHandle';
import { EntityCollection } from '../setup/entityCollection';

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


export class TableController {
    private static readonly SLIDE_SPEED = 1.0;
    private armFSM: ArmStateMachine;
    private opticsUnitss: OpticsUnit[];
    private table: Entity;
    private armBaseHandle: ArmBaseHandle;

    constructor(entities: EntityCollection) {
        this.table = entities.getActors().table;
        this.opticsUnitss = createOpticsUnits(this.table);
        this.armFSM = new ArmStateMachine();
        this.armBaseHandle = new ArmBaseHandle(entities);
    }

    public getArmState(): ArmState {
        return this.armFSM.getState();
    }

    public handleArmCommand(newCommand: ArmCommand): void {
        this.armFSM.transition(newCommand);
    }

    public getOpticsUnits(): OpticsUnit[] {
        return this.opticsUnitss;
    }

    public getOpticsUnitBySelectBox(selectBox: SelectBox): OpticsUnit | undefined {
        return this.opticsUnitss.find(unit => unit.selectBox === selectBox);
    }

    public setArmBasePositionScaled(scaledPosition: number): void {
        this.armBaseHandle.setArmBasePositionScaled(scaledPosition);
        this.armFSM.transition(ArmCommand.STOP);
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
        this.armBaseHandle.setArmPosition();
    }
}
