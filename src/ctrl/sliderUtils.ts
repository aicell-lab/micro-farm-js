import { URDFJoint, URDFRobot } from 'urdf-loader';
import { Entity } from '../entity/entity';
import * as THREE from 'three';

export function getSlideJoint(table: Entity): URDFJoint {
    const tableRobot = table.object as URDFRobot;
    return tableRobot.joints["slide-j"];
}

export function getSlideAngle(table: Entity): number {
    return getSlideJoint(table).angle as number;
}

export function getSlidePosition(table: Entity): THREE.Vector3 {
    const position = new THREE.Vector3();
    getSlideJoint(table).getWorldPosition(position);
    return position;
}
