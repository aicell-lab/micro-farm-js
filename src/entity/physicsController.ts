import * as THREE from 'three';
import Ammo from 'ammojs-typed';
import { AmmoSingleton } from '../setup/ammoSingleton';
import { PhysicsWorld } from '../system/physicsWorld';

function createBoxShape(object: THREE.Object3D): Ammo.btBoxShape {
    const Ammo = AmmoSingleton.get();

    const bbox = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const halfExtents = new Ammo.btVector3(size.x / 2, size.y / 2, size.z / 2);
    const shape = new Ammo.btBoxShape(halfExtents);

    return shape;
}

function createBody(object: THREE.Object3D, mass: number): Ammo.btRigidBody {
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

export class PhysicsController {

    body: Ammo.btRigidBody;
    object: THREE.Object3D;

    constructor(object: THREE.Object3D, mass: number, physicsWorld: PhysicsWorld) {
        this.object = object;
        this.body = createBody(object, mass);
        physicsWorld.addRigidBody(this.body, object);
    }

    updateObjectFromPhysics(): void {
        const Ammo = AmmoSingleton.get();
        const transform = new Ammo.btTransform();
        this.body.getMotionState().getWorldTransform(transform);
        const origin = transform.getOrigin();
        this.object.position.set(origin.x(), origin.y(), origin.z());
        const rotation = transform.getRotation();
        this.object.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
    }

    applyImpulse(force: THREE.Vector3, relativePosition?: THREE.Vector3): void {
        if (!this.body) return;

        const Ammo = AmmoSingleton.get();
        const impulse = new Ammo.btVector3(force.x, force.y, force.z);
        const relPos = relativePosition
            ? new Ammo.btVector3(relativePosition.x, relativePosition.y, relativePosition.z)
            : new Ammo.btVector3(0, 0, 0);

        this.body.applyImpulse(impulse, relPos);
    }
}
