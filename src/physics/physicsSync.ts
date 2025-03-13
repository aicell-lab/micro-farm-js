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

/*function getSimArmMeshes(entities: EntityCollection): THREE.Mesh[] {
    const arm = entities.getActors().arm;
    const base = arm.getMesh("arm-base")!;
    const arm1 = arm.getMesh("arm1")!;
    const arm2 = arm.getMesh("arm2")!;

    return [base, arm1, arm2];
}*/

export function syncGraphics(entities: EntityCollection, rigidBodyMap: Map<THREE.Mesh, Ammo.btRigidBody>) {
    getSimulatedObjects(entities).forEach((object) => {
        syncObject(object, rigidBodyMap);
    });

    /*getSimArmMeshes(entities).forEach((mesh) => {
        syncObject(mesh, rigidBodyMap);
    });*/
}
