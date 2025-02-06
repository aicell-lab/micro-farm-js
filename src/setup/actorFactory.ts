import { Actor } from "../actor/actor";
import * as THREE from 'three';
import { FLOOR_Y_POSITION } from "./constants";
import { RoomActors } from "../actor/roomActors";
import { MathUtils } from "three";
import { MeshStandardMaterial } from 'three';
import { PlayerController } from "../actor/playerController";
import { Robots } from '../setup/constants';
import { Assets } from '../res/assets';
import { ArmController } from "../actor/armController";

function setActorPosition(actor: Actor) {
    const boundingBox = new THREE.Box3().setFromObject(actor.object);
    const minY = boundingBox.min.y;
    if (minY < FLOOR_Y_POSITION) {
        actor.object.position.y -= minY;
    }
}

function createDefaultMaterial(): MeshStandardMaterial {
    const material = new MeshStandardMaterial({
        color: 0x008822,
        metalness: 0.3,
        roughness: 0.7
    });
    return material;
}

function createDefaultActorMesh(): THREE.Object3D {
    let object = new THREE.Object3D();
    const geometry = new THREE.BoxGeometry(0.5, 1.0, 0.5);
    const material = createDefaultMaterial();
    let mesh = new THREE.Mesh(geometry, material);

    object.add(mesh);
    return object;
}

export class ActorFactory {

    constructor() {

    }

    createHuman(): Actor {
        let playerController = new PlayerController();
        let human = new Actor(createDefaultActorMesh(), playerController, undefined);
        setActorPosition(human);
        return human;
    }

    createOpticalTable(): Actor {
        let tableRobot = Assets.getInstance().getRobots().get(Robots.OpticalTable)!;
        let table = new Actor(tableRobot, undefined, new ArmController(tableRobot));
        table.object.position.y += 0.855;
        table.object.position.x -= 2.0;
        table.object.position.z -= 0.7;
        table.object.rotation.x = MathUtils.degToRad(270.0);
        return table;
    }

    createActors(): RoomActors {
        return { player: this.createHuman(), table: this.createOpticalTable() };
    }
}


