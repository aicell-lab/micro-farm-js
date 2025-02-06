import { Actor } from './actor';
import { ArmController } from './armController';

export class OpticalTable extends Actor {
    armController: ArmController;

    constructor() {
        let armController = new ArmController();
        super(armController.getObject());
        this.armController = armController;
    }

    update(delta: number): void {
        this.armController.update(delta);
    }
}


