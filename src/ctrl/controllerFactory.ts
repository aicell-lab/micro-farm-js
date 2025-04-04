import * as THREE from 'three';
import { CameraController } from '../ctrl/cameraController';
import { UIController } from '../ui/uiController';
import { PlayerController } from '../ctrl/playerController';
import { TableController } from '../ctrl/tableController';
import { EntityCollection } from '../setup/entityCollection';
import { DialogController } from '../ui/dialogController';
import { OpticsUnit } from '../entity/opticsUnit';
import { OpticsUnitCollection } from './opticsUnitCollection';

export interface Controllers {
    ui: UIController;
    camera: CameraController;
    player: PlayerController;
    table: TableController;
    dialog: DialogController;
    opticsUnitCollection: OpticsUnitCollection;
}

function createOpticsUnits(entities: EntityCollection): OpticsUnit[] {
    const table = entities.getActors().table;
    return Array.from({ length: 10 }, (_, i) =>
        new OpticsUnit(table.bubbles[i], table.selectBoxes[i], i)
    );
}

export function createControllers(entities: EntityCollection, camera: THREE.PerspectiveCamera): Controllers {
    const actors = entities.getActors();
    const cameraController = new CameraController(actors.player.object, camera);
    const playerCtrl = new PlayerController(actors.player);
    const tableCtrl = new TableController(entities);
    const opticsUnitCollection = new OpticsUnitCollection(createOpticsUnits(entities));
    const uiCtrl = new UIController(camera, entities, opticsUnitCollection);

    return {
        player: playerCtrl,
        table: tableCtrl,
        camera: cameraController,
        ui: uiCtrl,
        dialog: new DialogController(),
        opticsUnitCollection: opticsUnitCollection,
    };
}
