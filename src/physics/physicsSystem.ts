import { PhysicsWorld } from './physicsWorld';
import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import Ammo from 'ammojs-typed';
import { AmmoUtils } from './physicsUtil';

export class PhysicsSystem {
    private entities: EntityCollection;
    private world: PhysicsWorld;
    private objects: Map<THREE.Mesh, Ammo.btRigidBody> = new Map();
    private masses: Map<THREE.Mesh, number> = new Map();

    constructor(entities: EntityCollection) {
        this.entities = entities;
        this.world = new PhysicsWorld();
        this.initializePhysics();
    }

    private initializePhysics(): void {
        const room = this.entities.getRoom();
        this.addObject(room.cube.object, 1.0);
        this.addObject(room.floor.object, 0.0);
        AmmoUtils.applyImpulse(new THREE.Vector3(4.5, 0, 0), [...this.objects.values()]);
        this.world.addRigidBodies([...this.objects.entries()]);
    }

    public step(dt: number): void {
        let slowedDT = dt / 10.0;
        this.world.step(slowedDT);
    }

    public getRigidBodyMap(): Map<THREE.Mesh, Ammo.btRigidBody> {
        return this.objects;
    }

    private addObject(object: THREE.Object3D, mass: number): void {
        const mesh = AmmoUtils.getMesh(object);
        this.objects.set(mesh, AmmoUtils.createBody(mesh, mass));
        this.masses.set(mesh, mass);
    }
} 