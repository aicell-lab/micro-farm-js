import * as THREE from 'three';
import Ammo from 'ammojs-typed';
import { AmmoSingleton } from '../setup/ammoSingleton';

function createPhysicsWorld(): Ammo.btDiscreteDynamicsWorld {
    const Ammo = AmmoSingleton.get();
    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
        overlappingPairCache = new Ammo.btDbvtBroadphase(),
        solver = new Ammo.btSequentialImpulseConstraintSolver();
    const world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    return world;
}

export class PhysicsWorld {
    private world: Ammo.btDiscreteDynamicsWorld;
    private rigidBodies: Ammo.btRigidBody[] = [];
    private objectMap: Map<number, THREE.Object3D> = new Map();
    private nextUserIndex = 0;

    constructor() {
        this.world = createPhysicsWorld();
        const Ammo = AmmoSingleton.get();
        this.world.setGravity(new Ammo.btVector3(0, -10, 0));
    }

    step(dt: number) {
        const maxSubSteps = 10;
        this.world.stepSimulation(dt, maxSubSteps);
    }

    addRigidBody(body: Ammo.btRigidBody, object: THREE.Object3D): void {
        const userIndex = this.nextUserIndex++;
        body.setUserIndex(userIndex);
        this.objectMap.set(userIndex, object);
        this.rigidBodies.push(body);
        this.world.addRigidBody(body);
    }
}
