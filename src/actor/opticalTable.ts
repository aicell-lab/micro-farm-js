import { Actor } from './actor';
import { MovePayload } from '../types/actionType';
import { Robots } from '../setup/constants';
import { Assets } from '../res/assets';
import { URDFRobot } from 'urdf-loader';

export class OpticalTable extends Actor {
    table!: URDFRobot;

    constructor() {
        let table = Assets.getInstance().getRobots().get(Robots.OpticalTable)!;
        super(table);
        this.table = table;
    }

    handleMove(_: MovePayload): void {
    }
}


