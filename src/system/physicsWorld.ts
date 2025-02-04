import Ammo from 'ammojs-typed';
import { AmmoSingleton } from '../setup/ammoSingleton';

export class PhysicsWorld {
    private world: Ammo.btDiscreteDynamicsWorld;
    private rigidBodies: Ammo.btRigidBody[] = [];

    constructor() {
        const Ammo = AmmoSingleton.get();
        let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
            dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
            overlappingPairCache = new Ammo.btDbvtBroadphase(),
            solver = new Ammo.btSequentialImpulseConstraintSolver();
        this.world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        this.world.setGravity(new Ammo.btVector3(0, -10, 0));

    }

    step(dt: number) {
        const maxSubSteps = 10;
        this.world.stepSimulation(dt, maxSubSteps);

    }

    addRigidBody(body: Ammo.btRigidBody): void {
        this.rigidBodies.push(body);
        this.world.addRigidBody(body);
    }

}