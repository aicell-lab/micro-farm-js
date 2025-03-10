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
    private constraints: Ammo.btTypedConstraint[] = [];

    constructor() {
        this.world = createPhysicsWorld();
        const Ammo = AmmoSingleton.get();
        this.world.setGravity(new Ammo.btVector3(0, -10, 0));
    }

    public step(dt: number): void {
        const maxSubSteps = 10;
        this.world.stepSimulation(dt, maxSubSteps);
    }

    public addRigidBodies(bodies: [THREE.Mesh, Ammo.btRigidBody][]): void {
        bodies.forEach(([mesh, body]) => {
            this.addRigidBody(body, mesh);
        });
    }

    public addRigidBody(body: Ammo.btRigidBody, mesh: THREE.Mesh): void {
        body.setUserPointer(mesh);
        this.rigidBodies.push(body);
        this.world.addRigidBody(body);
        this.world.addCollisionObject
    }

    public addConstraint(constraint: Ammo.btTypedConstraint, disableCollisionsBetweenLinkedBodies = true): void {
        this.world.addConstraint(constraint, disableCollisionsBetweenLinkedBodies);
        this.constraints.push(constraint);
    }

    public removeConstraint(constraint: Ammo.btTypedConstraint): void {
        this.world.removeConstraint(constraint);
        const index = this.constraints.indexOf(constraint);
        if (index >= 0) this.constraints.splice(index, 1);
    }

}
