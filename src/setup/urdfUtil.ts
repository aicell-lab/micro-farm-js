import * as THREE from 'three';
import { URDFVisual, URDFRobot } from "urdf-loader";

export function getMeshFromJoint(robot: URDFRobot, jointName: string): THREE.Mesh | null {
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

export function applyMaterialToVisuals(obj: THREE.Object3D, color: number) {
    if (obj.type === "URDFVisual") {
        let visual = obj as URDFVisual;
        visual.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({ color });
            }
        });
    }
    for (const child of obj.children) {
        applyMaterialToVisuals(child, color);
    }
}

