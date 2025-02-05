import * as THREE from 'three';
import Ammo from 'ammojs-typed';
import { AmmoSingleton } from '../setup/ammoSingleton';
import { PhysicsWorld } from '../system/physicsWorld';

export abstract class RoomObject {
    object: THREE.Object3D;
    body?: Ammo.btRigidBody;

    constructor(object: THREE.Object3D) {
        this.object = object;
    }

    getBoxShape(): Ammo.btBoxShape {
        const Ammo = AmmoSingleton.get();

        const bbox = new THREE.Box3().setFromObject(this.object);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const halfExtents = new Ammo.btVector3(size.x / 2, size.y / 2, size.z / 2);
        const shape = new Ammo.btBoxShape(halfExtents);

        return shape;
    }

    addPhysics(mass: number, physicsWorld: PhysicsWorld): void {
        const Ammo = AmmoSingleton.get();
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(
            this.object.position.x,
            this.object.position.y,
            this.object.position.z
        ));

        const motionState = new Ammo.btDefaultMotionState(transform);
        const shape = this.getBoxShape();
        const localInertia = new Ammo.btVector3(0, 0, 0);
        if (mass > 0) shape.calculateLocalInertia(mass, localInertia);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        this.body = new Ammo.btRigidBody(rbInfo);
        physicsWorld.addRigidBody(this.body, this.object);
    }

    updateFromPhysics(): void {
        if (!this.body) return;
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

