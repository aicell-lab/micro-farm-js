import * as THREE from 'three';
import Ammo from 'ammojs-typed';
import { AmmoSingleton } from '../setup/ammoSingleton';

function changeObjectColor(object: THREE.Object3D, color: THREE.Color | string | number) {
    object.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                    mat.color.set(color);
                    mat.needsUpdate = true;
                });
            } else {
                child.material.color.set(color);
                child.material.needsUpdate = true;
            }
        }
    });
}

export class PhysicsWorld {
    private world: Ammo.btDiscreteDynamicsWorld;
    private rigidBodies: Ammo.btRigidBody[] = [];
    private objectMap: Map<number, THREE.Object3D> = new Map();
    private nextUserIndex = 0;

    private originalMaterials: Map<THREE.Object3D, THREE.Material | THREE.Material[]> = new Map();
    private collidingObjects: Set<THREE.Object3D> = new Set();

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


        const newColliding = new Set<THREE.Object3D>();

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
                const objectA = this.objectMap.get(bodyA.getUserIndex());
                const objectB = this.objectMap.get(bodyB.getUserIndex());
                const collisionColor = new THREE.Color(0.5, 0.5, 0.5);

                if (objectA) {
                    newColliding.add(objectA);
                    changeObjectColor(objectA, collisionColor);
                }
                if (objectB) {
                    newColliding.add(objectB);
                    changeObjectColor(objectB, collisionColor);
                }
            }
        }

        this.collidingObjects.forEach((object) => {
            if (!newColliding.has(object)) {
                this.restoreOriginalMaterial(object);
            }
        });

        this.collidingObjects = newColliding;
    }

    private storeOriginalMaterial(object: THREE.Object3D) {
        object.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                if (!this.originalMaterials.has(child)) {
                    if (Array.isArray(child.material)) {
                        this.originalMaterials.set(child, child.material.map(mat => mat.clone()));
                    } else {
                        this.originalMaterials.set(child, child.material.clone());
                    }
                }
            }
        });
    }

    private restoreOriginalMaterial(object: THREE.Object3D) {
        object.traverse((child) => {
            if (child instanceof THREE.Mesh && this.originalMaterials.has(child)) {
                const originalMaterial = this.originalMaterials.get(child)!;

                if (Array.isArray(originalMaterial)) {
                    child.material = originalMaterial.map(mat => mat.clone());
                } else {
                    child.material = originalMaterial.clone();
                }

                child.material.needsUpdate = true;
            }
        });
    }

    addRigidBody(body: Ammo.btRigidBody, object: THREE.Object3D): void {
        const userIndex = this.nextUserIndex++;
        body.setUserIndex(userIndex);
        this.objectMap.set(userIndex, object);
        this.rigidBodies.push(body);
        this.world.addRigidBody(body);
        this.storeOriginalMaterial(object);
    }

}