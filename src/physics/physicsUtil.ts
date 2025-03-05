import * as THREE from 'three';
import Ammo from 'ammojs-typed';
import { AmmoSingleton } from '../setup/ammoSingleton';

export namespace AmmoUtils {
    export function createBoxShape(object: THREE.Mesh): Ammo.btBoxShape {
        const Ammo = AmmoSingleton.get();
        const bbox = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const halfExtents = new Ammo.btVector3(size.x / 2, size.y / 2, size.z / 2);
        return new Ammo.btBoxShape(halfExtents);
    }

    export function createBody(object: THREE.Mesh, mass: number): Ammo.btRigidBody {
        const Ammo = AmmoSingleton.get();
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(
            object.position.x,
            object.position.y,
            object.position.z
        ));

        const motionState = new Ammo.btDefaultMotionState(transform);
        const shape = createBoxShape(object);
        const localInertia = new Ammo.btVector3(0, 0, 0);
        if (mass > 0) shape.calculateLocalInertia(mass, localInertia);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        return new Ammo.btRigidBody(rbInfo);
    }

    export function getMesh(object: THREE.Object3D): THREE.Mesh {
        if (object instanceof THREE.Mesh) {
            return object;
        }
        const mesh = object.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh | undefined;
        if (!mesh) {
            throw new Error("No Mesh found in object");
        }
        return mesh;
    }

    export function applyImpulse(force: THREE.Vector3, bodies: Array<Ammo.btRigidBody>): void {
        const Ammo = AmmoSingleton.get();
        const impulse = new Ammo.btVector3(force.x, force.y, force.z);
        const relPos = new Ammo.btVector3(0, 0, 0);
        bodies.forEach((body) => { body.applyImpulse(impulse, relPos) });
    }

    export function getPositionRotation(body: Ammo.btRigidBody): [THREE.Vector3, THREE.Quaternion] {
        const transform = getWorldTransform(body);
        const origin = transform.getOrigin();
        const position = new THREE.Vector3(origin.x(), origin.y(), origin.z());
        const rotation = transform.getRotation();
        const quaternion = new THREE.Quaternion(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        return [position, quaternion];
    }

    export function getWorldTransform(body: Ammo.btRigidBody): Ammo.btTransform {
        const Ammo = AmmoSingleton.get();
        const transform = new Ammo.btTransform();
        body.getMotionState().getWorldTransform(transform);
        return transform;
    }
}
