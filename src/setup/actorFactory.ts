import { Entity, EntityOptions } from "../entity/entity";
import * as THREE from 'three';
import { FLOOR_Y_POSITION } from "./constants";
import { Actors } from './entityCollection';
import { MathUtils } from "three";
import { Assets } from '../assets/assets';
import { Robots, Animations } from "./enums";
import { Bubble } from "../entity/bubble";
import { AnimationAsset } from "../assets/animationLoader";
import { SelectBox } from "../entity/selectBox";
import { applyMaterialToVisuals, createMaterial, getLinkMeshMap } from "./urdfUtil";


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

function validateTableEntity(table: Entity): void {
    const numOptics = 10;
    if (table.bubbles.length !== numOptics) {
        throw new Error(`Expected exactly ${numOptics} speech buubles.`);
    }
    if (table.selectBoxes.length !== numOptics) {
        throw new Error(`Expected exactly ${numOptics} selection boxes.`);
    }
}

function setMeshColor(mesh: THREE.Mesh, color: number): void {
    mesh.material = createMaterial(color);
}

export class ActorFactory {

    constructor() {

    }

    private colorizeArm(arm: Entity): void {
        applyMaterialToVisuals(arm.object, createMaterial, 0xff0000);

        const highlightColors: Record<string, number> = {
            "gripper": 0x00fff0,
            "arm-base": 0x00fff0,
        };

        for (const [name, color] of Object.entries(highlightColors)) {
            const mesh = arm.getMesh(name);
            if (mesh) {
                setMeshColor(mesh, color);
            } else {
                console.warn(`Mesh "${name}" not found on arm`);
            }
        }
    }

    private setArmTransform(arm: Entity): void {
        const armObj = arm.object;
        armObj.position.y += 2.0;
        armObj.rotation.x = MathUtils.degToRad(270.0);
        armObj.updateMatrixWorld(true);
    }

    private buildArmObject(): Entity {
        let armRobot = Assets.getInstance().getRobots().get(Robots.Arm)!;
        const meshes = getLinkMeshMap(armRobot)
        const entity = new Entity({
            object: armRobot,
            meshes: meshes,
        });
        return entity;
    }

    createArm(): Entity {
        const arm = this.buildArmObject();
        this.setArmTransform(arm);
        this.colorizeArm(arm);
        return arm;
    }

    createHuman(): Entity {
        let animAsset = loadAnimatioAsset(Animations.Human);
        const options: EntityOptions = {
            object: animAsset.model,
        };
        options.object.animations = animAsset.animations;
        let human = new Entity(options);
        const rotY = THREE.MathUtils.degToRad(180.0);
        human.object.rotateY(rotY);
        human.object.scale.set(0.2, 0.2, 0.2);
        setActorPosition(human);
        human.object.position.z = 3.0;
        human.object.position.x = -0.5;
        return human;
    }

    private colorizeTable(table: Entity): void {
        const obj = table.object;
        const meshes = table.meshes;
        applyMaterialToVisuals(obj, createMaterial, 0xfffff0);
        const orange: number = 0xee6600;
        setMeshColor(meshes.get("plate-microscope")!, orange);
        setMeshColor(meshes.get("plate-incubator")!, orange);
        setMeshColor(meshes.get("slide")!, orange);
    }

    private setTableTransform(table: Entity): void {
        table.object.position.y += 0.855;
        table.object.rotation.x = MathUtils.degToRad(270.0);
        table.object.updateMatrixWorld(true);
    }

    private buildTableObject(): Entity {
        let tableRobot = Assets.getInstance().getRobots().get(Robots.OpticalTable)!;
        const meshes = getLinkMeshMap(tableRobot);
        const bubbles = Array.from({ length: 10 }, () => new Bubble());
        const selectBoxes = Array.from({ length: 10 }, () => new SelectBox());
        const table = new Entity({
            object: tableRobot,
            meshes: meshes,
        });
        table.bubbles = bubbles;
        table.selectBoxes = selectBoxes;
        return table;
    }

    createOpticalTable(): Entity {
        const table = this.buildTableObject();
        this.setTableTransform(table);
        this.colorizeTable(table);
        return table;
    }

    createActors(): Actors {
        const table = this.createOpticalTable();
        validateTableEntity(table);
        return { player: this.createHuman(), table: table, arm: this.createArm() };
    }
}


