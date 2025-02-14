import { Entity, EntityOptions } from "../entity/entity";
import * as THREE from 'three';
import { FLOOR_Y_POSITION } from "./constants";
import { Actors } from '../setup/room';
import { MathUtils } from "three";
import { MeshStandardMaterial } from 'three';
import { PlayerController } from "../entity/playerController";
import { Assets } from '../res/assets';
import { ArmController } from "../entity/armController";
import { Robots, Animations } from "./enums";
import { AnimatedObject } from "../entity/playerController";
import { createBubbleStatus } from "../entity/nameplate";

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
        let animObj = new AnimatedObject(Animations.Human);
        const options: EntityOptions = {
            object: createDefaultActorMesh(),
            playerController: new PlayerController(animObj)
        };
        let human = new Entity(options);

        const rot = THREE.MathUtils.degToRad(180.0);
        human.object.rotateY(rot);
        setActorPosition(human);
        human.object.position.z = -2.0;
        human.object.position.x = 2.0;
        return human;
    }

    createOpticalTable(): Entity {
        let tableRobot = Assets.getInstance().getRobots().get(Robots.OpticalTable)!;
        let bubble = createBubbleStatus();
        let bubbles = [bubble];
        const options: EntityOptions = {
            object: tableRobot,
            armController: new ArmController(tableRobot, bubbles)
        };
        let table = new Entity(options);
        table.bubbles = bubbles;
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


