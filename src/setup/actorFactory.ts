import { Entity, EntityOptions } from "../entity/entity";
import * as THREE from 'three';
import { FLOOR_Y_POSITION } from "./constants";
import { Actors } from "../entity/roomActors";
import { MathUtils } from "three";
import { MeshStandardMaterial } from 'three';
import { PlayerController } from "../entity/playerController";
import { Robots } from '../setup/constants';
import { Assets } from '../res/assets';
import { ArmController } from "../entity/armController";

function setActorPosition(actor: Entity) {
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

    createHuman(): Entity {
        const options: EntityOptions = {
            object: createDefaultActorMesh(),
            playerController: new PlayerController()
        };
        let human = new Entity(options);
        setActorPosition(human);
        return human;
    }

    createOpticalTable(): Entity {
        let tableRobot = Assets.getInstance().getRobots().get(Robots.OpticalTable)!;
        const options: EntityOptions = {
            object: tableRobot,
            armController: new ArmController(tableRobot)
        };
        let table = new Entity(options);
        table.object.position.y += 0.855;
        table.object.position.x -= 2.0;
        table.object.position.z -= 0.7;
        table.object.rotation.x = MathUtils.degToRad(270.0);
        return table;
    }

    createActors(): Actors {
        return { player: this.createHuman(), table: this.createOpticalTable() };
    }
}


