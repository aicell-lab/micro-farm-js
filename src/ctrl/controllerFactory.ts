import * as THREE from 'three';
import { CameraController } from '../ctrl/cameraController';
import { UIController } from '../ctrl/uiController';
import { PlayerController } from '../ctrl/playerController';
import { TableController } from '../ctrl/tableController';
import { EntityCollection } from '../setup/entityCollection';
import { DialogController } from '../ctrl/dialogController';

export interface Controllers {
    ui: UIController;
    camera: CameraController;
    player: PlayerController;
    table: TableController;
    dialog: DialogController;
}

export function createControllers(entities: EntityCollection, camera: THREE.PerspectiveCamera): Controllers {
    const actors = entities.getActors();
    const cameraController = new CameraController(actors.player.object, camera);
    const playerCtrl = new PlayerController(actors.player);
    const tableCtrl = new TableController(actors.table, actors.arm);
    const uiCtrl = new UIController(camera, entities, tableCtrl);

    return {
        player: playerCtrl,
        table: tableCtrl,
        camera: cameraController,
        ui: uiCtrl,
        dialog: new DialogController(),
    };
}
