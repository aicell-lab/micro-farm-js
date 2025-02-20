import { Entity, EntityOptions } from "../entity/entity";
import * as THREE from 'three';
import { FLOOR_Y_POSITION } from "./constants";
import { Actors } from './entityCollection';
import { MathUtils } from "three";
import { MeshStandardMaterial } from 'three';
import { Assets } from '../res/assets';
import { TableController } from "../entity/tableController";
import { Robots, Animations, Textures } from "./enums";
import { Bubble } from "../entity/bubble";
import { AnimationAsset } from "../res/animationLoader";

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

function loadAnimatioAsset(animationType: Animations): AnimationAsset {
    let animationAssets = Assets.getInstance().getAnimations();
    return animationAssets.get(animationType)!;
}

export class ActorFactory {

    constructor() {

    }

    createHuman(): Entity {
        let animAsset = loadAnimatioAsset(Animations.Human);
        const options: EntityOptions = {
            object: animAsset.model,
            animations: animAsset.animations,
        };
        let human = new Entity(options);
        const rotY = THREE.MathUtils.degToRad(90.0);
        human.object.rotateY(rotY);
        
        setActorPosition(human);
        human.object.position.z = 3.0;
        human.object.position.x = -0.5;
        return human;
    }

    createOpticalTable(): Entity {
        let tableRobot = Assets.getInstance().getRobots().get(Robots.OpticalTable)!;
        let bubble = new Bubble();
        let bubbles = [bubble];
        let armController = new TableController(tableRobot, bubbles);
        const options: EntityOptions = {
            object: tableRobot
        };
        let table = new Entity(options);
        table.bubbles = bubbles;
        table.object.position.y += 0.855;
        table.object.position.x -= 2.0;
        table.object.position.z -= 0.7;
        table.object.rotation.x = MathUtils.degToRad(270.0);
        armController.adjustBubblePositions();
        return table;
    }

    createActors(): Actors {
        return { player: this.createHuman(), table: this.createOpticalTable() };
    }
}


