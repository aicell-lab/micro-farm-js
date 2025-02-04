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
        const shape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 0.5, 0.5));
        const localInertia = new Ammo.btVector3(0, 0, 0);
        if (mass > 0) shape.calculateLocalInertia(mass, localInertia);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        this.body = new Ammo.btRigidBody(rbInfo);
        physicsWorld.addRigidBody(this.body);
    }

    updateFromPhysics(): void {
        if (!this.body) return;
        const Ammo = AmmoSingleton.get();
        const transform = new Ammo.btTransform();
        this.body.getMotionState().getWorldTransform(transform);
        const origin = transform.getOrigin();
        this.object.position.set(origin.x(), origin.y(), origin.z());
    }
}

