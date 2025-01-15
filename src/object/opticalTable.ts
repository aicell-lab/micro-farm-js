import { RoomObject } from "./roomObject";
import { Models } from '../types/models';
import { Assets } from '../res/assets';

export class OpticalTable extends RoomObject {

    constructor() {
        let modelMap = Assets.getInstance().getModels();
        let table = modelMap.get(Models.OpticalTable)!;
        super(table);
    }

}


