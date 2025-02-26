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

import { URDFVisual, URDFRobot } from "urdf-loader";

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

function getMeshFromJoint(robot: URDFRobot, jointName: string): THREE.Mesh | null {
    const joint = robot.joints[jointName];
    if (!joint) {
        console.warn(`Joint "${jointName}" not found.`);
        return null;
    }
    // Get the child link name from the joint definition
    const jointNode = joint.urdfNode;
    if (!jointNode) {
        console.warn(`No URDF node found for joint "${jointName}".`);
        return null;
    }
    const childElement = jointNode.querySelector("child");
    if (!childElement) {
        console.warn(`Joint "${jointName}" has no child link.`);
        return null;
    }
    const childLinkName = childElement.getAttribute("link");
    if (!childLinkName) {
        console.warn(`Child link attribute missing for joint "${jointName}".`);
        return null;
    }
    //console.log(`Joint "${jointName}" is connected to child link: "${childLinkName}"`);
    const childLink = robot.links[childLinkName];
    if (!childLink) {
        console.warn(`Child link "${childLinkName}" not found in URDF.`);
        return null;
    }
    // Search for a visual object in the child link
    let visual: URDFVisual | null = null;
    childLink.traverse((child) => {
        if ((child as URDFVisual).isURDFVisual) {
            visual = child as URDFVisual;
        }
    });
    if (!visual) {
        console.warn(`No visual found for child link "${childLinkName}".`);
        return null;
    }
    let vis = visual as URDFVisual;
    if (vis.children.length > 0) {
        const firstChild = vis.children[0];
        if (firstChild instanceof THREE.Mesh) {
            // console.log(`Mesh found for joint "${jointName}" ->`, firstChild);
            return firstChild;
        } else {
            console.warn(`First child of visual for "${childLinkName}" is not a mesh.`);
            return null;
        }
    } else {
        console.warn(`Visual for child link "${childLinkName}" has no children.`);
        return null;
    }
}



export class ActorFactory {

    constructor() {

    }

    createArm(): Entity {
        let armRobot = Assets.getInstance().getRobots().get(Robots.Arm)!;
        const options: EntityOptions = {
            object: armRobot
        };
        let arm = new Entity(options);
        //console.log(arm.object);
        arm.object.position.y += 2.0;
        arm.object.rotation.x = MathUtils.degToRad(270.0);

        function applyMaterialToVisuals(obj: THREE.Object3D) {
            //console.log(obj.type);
            if (obj.type === "URDFVisual") {
                let visual = obj as URDFVisual;
                visual.traverse(child => {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                    }
                });
            }
            for (const child of obj.children) {
                applyMaterialToVisuals(child);
            }
        }
        applyMaterialToVisuals(arm.object);

        const mesh = getMeshFromJoint(armRobot, "arm1j");
        if (mesh) {
            console.log("Retrieved mesh via joint:", mesh);
            mesh.material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        }

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
        return table;
    }

    createActors(): Actors {
        return { player: this.createHuman(), table: this.createOpticalTable(), arm: this.createArm() };
    }
}


