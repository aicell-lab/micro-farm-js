import { Entity, EntityOptions } from "../entity/entity";
import * as THREE from 'three';
import { FLOOR_Y_POSITION } from "./constants";
import { Actors } from './entityCollection';
import { MathUtils } from "three";
import { Assets } from '../res/assets';
import { Robots, Animations } from "./enums";
import { Bubble } from "../entity/bubble";
import { AnimationAsset } from "../res/animationLoader";
import { SelectBox } from "../entity/selectBox";
import { applyMaterialToVisuals, getLinkMesh, createMaterial } from "./urdfUtil";


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

    createArmTest(): Entity {
        let object = new THREE.Object3D();
        let armTest = new Entity({ object: object });
        let sliderGeometry = new THREE.BoxGeometry(2, 0.1, 0.1);
        let sliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00aa00 });
        let sliderMesh = new THREE.Mesh(sliderGeometry, sliderMaterial);
        let boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        let boxMaterial = new THREE.MeshBasicMaterial({ color: 0x992000, transparent: true, opacity: 0.9  });
        let boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMesh.position.set(1, 0.75, 2);
        sliderMesh.position.set(2, 0.75, 2);
        object.add(sliderMesh);
        object.add(boxMesh);
        return armTest;
    }

    createArm(): Entity {
        let armRobot = Assets.getInstance().getRobots().get(Robots.Arm)!;
        const options: EntityOptions = {
            object: armRobot
        };
        let arm = new Entity(options);
        arm.object.position.y += 2.0;
        arm.object.rotation.x = MathUtils.degToRad(270.0);

        applyMaterialToVisuals(arm.object, createMaterial, 0xff0000);
        getLinkMesh("gripper", arm.object)!.material = createMaterial(0x00fff0);
        getLinkMesh("arm-base", arm.object)!.material = createMaterial(0x00fff0);
        arm.object.updateMatrixWorld(true);
        return arm;
    }

    createHuman(): Entity {
        let animAsset = loadAnimatioAsset(Animations.Human);
        const options: EntityOptions = {
            object: animAsset.model,
            animations: animAsset.animations,
        };
        let human = new Entity(options);
        const rotY = THREE.MathUtils.degToRad(180.0);
        human.object.rotateY(rotY);
        human.object.scale.set(0.2, 0.2, 0.2);
        setActorPosition(human);
        human.object.position.z = 3.0;
        human.object.position.x = -0.5;
        return human;
    }

    createOpticalTable(): Entity {
        let tableRobot = Assets.getInstance().getRobots().get(Robots.OpticalTable)!;
        const bubbles = Array.from({ length: 10 }, () => new Bubble());
        const selectBoxes = Array.from({ length: 10 }, () => new SelectBox());
        const options: EntityOptions = {
            object: tableRobot
        };
        let table = new Entity(options);
        table.bubbles = bubbles;
        table.selectBoxes = selectBoxes;
        table.object.position.y += 0.855;
        table.object.rotation.x = MathUtils.degToRad(270.0);
        applyMaterialToVisuals(table.object, createMaterial, 0xfffff0);
        getLinkMesh("plate-microscope", table.object)!.material = createMaterial(0xee6600);
        getLinkMesh("plate-incubator", table.object)!.material = createMaterial(0xee6600);
        getLinkMesh("slide", table.object)!.material = createMaterial(0xee6600);
        table.object.updateMatrixWorld(true);
        return table;
    }

    createActors(): Actors {
        return { player: this.createHuman(), table: this.createOpticalTable(), arm: this.createArm(), armTest: this.createArmTest() };
    }
}


