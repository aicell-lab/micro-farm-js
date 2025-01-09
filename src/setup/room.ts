import * as THREE from 'three';
import { Assets } from '../res/assets';
import { getFloor } from './roomExterior';
import { Models } from '../types/models';
import {TABLE_ROTATION_DEGREES, FLOOR_Y_POSITION} from './roomConstants'
import { MathUtils } from 'three';

function setFloorPosition(object: THREE.Object3D) {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const minY = boundingBox.min.y;
    if (minY < FLOOR_Y_POSITION) {
        object.position.y -= minY;
    }
}


export class Room {
    floor: THREE.Object3D;
    opticalTable: THREE.Object3D;

    constructor() {
        let modelMap = Assets.getInstance().getModels();
        this.floor = getFloor();
        this.opticalTable = modelMap.get(Models.OpticalTable)!;
        this.setTablePosition();
    }

    private setTablePosition(): void {
        setFloorPosition(this.opticalTable);
        this.opticalTable.rotation.x = MathUtils.degToRad(TABLE_ROTATION_DEGREES);
    }
}
