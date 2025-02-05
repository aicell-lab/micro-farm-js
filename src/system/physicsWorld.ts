import * as THREE from 'three';
import Ammo from 'ammojs-typed';
import { AmmoSingleton } from '../setup/ammoSingleton';

export class PhysicsWorld {
    private world: Ammo.btDiscreteDynamicsWorld;
    private rigidBodies: Ammo.btRigidBody[] = [];
    private objectMap: Map<number, THREE.Object3D> = new Map();
    private nextUserIndex = 0;

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

        const dispatcher = this.world.getDispatcher();
        const numManifolds = dispatcher.getNumManifolds();
        for (let i = 0; i < numManifolds; i++) {
            const contactManifold = dispatcher.getManifoldByIndexInternal(i);
            const bodyA = contactManifold.getBody0() as Ammo.btRigidBody;
            const bodyB = contactManifold.getBody1() as Ammo.btRigidBody;
            const numContacts = contactManifold.getNumContacts();
            let collisionDetected = false;

            for (let j = 0; j < numContacts; j++) {
                const pt = contactManifold.getContactPoint(j);
                if (pt.getDistance() < 0) {
                    collisionDetected = true;
                }
            }

            if (collisionDetected) {
                /*console.log("Collision detected.");
                const objectA = this.objectMap.get(bodyA.getUserIndex());
                const objectB = this.objectMap.get(bodyB.getUserIndex());
                let mesh: THREE.Mesh | undefined = undefined;

                if (objectB instanceof THREE.Mesh) {
                    mesh = objectB;
                } else if (objectB) {
                    objectB.traverse((child) => {
                        if (child instanceof THREE.Mesh && !mesh) {
                            mesh = child;
                        }
                    });
                }

                if (mesh) {
                    (mesh.material as THREE.MeshStandardMaterial).color.set(0xff0000);
                }*/
            }
        }
    }

    addRigidBody(body: Ammo.btRigidBody, object: THREE.Object3D): void {
        const userIndex = this.nextUserIndex++;
        body.setUserIndex(userIndex);
        this.objectMap.set(userIndex, object);
        this.rigidBodies.push(body);
        this.world.addRigidBody(body);
    }

}