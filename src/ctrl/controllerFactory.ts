import * as THREE from 'three';
import { CameraController } from '../ctrl/cameraController';
import { PhysicsSystem } from '../physics/physicsSystem';
import { EventMediator } from '../ctrl/eventMediator';
import { RenderController, createCamera } from '../ctrl/renderController';
import { UIController } from '../ctrl/uiController';
import { PlayerController } from '../ctrl/playerController';
import { TableController } from '../ctrl/tableController';
import { EntityCollection } from '../setup/entityCollection';
import { DialogController } from '../ctrl/dialogController';

export interface Controllers {
    ui: UIController;
    camera: CameraController;
    render: RenderController;
    eventMediator: EventMediator;
    player: PlayerController;
    table: TableController;
    dialog: DialogController;
}

export function createControllers(entities: EntityCollection, scene: THREE.Scene, physicsSystem: PhysicsSystem): Controllers {
    let actors = entities.getActors();
    let camera = createCamera();
    let cameraController = new CameraController(actors.player.object, camera);
    let player = new PlayerController(entities.getActors().player);
    let table = new TableController(actors.table, actors.arm);
    let ui = new UIController(camera, entities, table);
    let render = new RenderController(scene, camera);
    let eventMediator = new EventMediator(actors, player, table, physicsSystem);

    return {
        player: player,
        table: table,
        camera: cameraController,
        ui: ui,
        render: render,
        eventMediator: eventMediator,
        dialog: new DialogController(),
    };
}
