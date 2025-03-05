import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import Ammo from 'ammojs-typed';
import { AmmoUtils } from './physicsUtil';

function getRigidBody(object: THREE.Object3D, rigidBodyMap: Map<THREE.Mesh, Ammo.btRigidBody>): Ammo.btRigidBody {
    const mesh = AmmoUtils.getMesh(object);
    const body = rigidBodyMap.get(mesh);
    if (!body) throw new Error("Body not found");
    return body;
}

function syncObject(object: THREE.Object3D, rigidBodyMap: Map<THREE.Mesh, Ammo.btRigidBody>): void {
    const [origin, rotation] = AmmoUtils.getPositionRotation(getRigidBody(object, rigidBodyMap));
    object.position.set(origin.x, origin.y, origin.z);
    object.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
}

function getSimulatedObjects(entities: EntityCollection): Array<THREE.Object3D> {
    const cube = entities.getRoom().cube;
    const cubeObj = cube.object;
    return [cubeObj];
}

export function syncGraphics(entities: EntityCollection, rigidBodyMap: Map<THREE.Mesh, Ammo.btRigidBody>) {
    getSimulatedObjects(entities).forEach((object) => {
        syncObject(object, rigidBodyMap);
    });
}
