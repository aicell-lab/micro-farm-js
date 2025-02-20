import { Entity, EntityOptions } from "../entity/entity";
import * as THREE from 'three';
import { FLOOR_Y_POSITION } from "./constants";
import { Actors } from './entityCollection';
import { MathUtils } from "three";
import { Assets } from '../res/assets';
import { TableController } from "../ctrl/tableController";
import { Robots, Animations } from "./enums";
import { Bubble } from "../entity/bubble";
import { AnimationAsset } from "../res/animationLoader";

function setActorPosition(actor: Entity) {
    const boundingBox = new THREE.Box3().setFromObject(actor.object);
    const minY = boundingBox.min.y;
    if (minY < FLOOR_Y_POSITION) {
        actor.object.position.y -= minY;
    }
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
        const rotX = THREE.MathUtils.degToRad(-90.0);
        human.object.rotateX(rotX);
        
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


