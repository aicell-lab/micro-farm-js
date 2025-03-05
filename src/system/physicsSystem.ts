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
        AmmoUtils.applyImpulse(new THREE.Vector3(4.5, 0, 0), this.getRigidBodies());
        this.world.addRigidBodies(this.getMeshRigidBodyPairs());
    }

    public step(dt: number): void {
        let slowedDT = dt / 10.0;
        this.world.step(slowedDT);
    }

    public getRigidBodyMap(): Map<THREE.Mesh, Ammo.btRigidBody> {
        return this.objects;
    }

    private addMesh(mesh: THREE.Mesh, mass: number): void {
        this.objects.set(mesh, AmmoUtils.createBody(mesh, mass));
        this.masses.set(mesh, mass);
    }

    private addObject(object: THREE.Object3D, mass: number): void {
        const mesh = AmmoUtils.getMesh(object);
        this.addMesh(mesh, mass);
    }

    private getMeshRigidBodyPairs(): [THREE.Mesh, Ammo.btRigidBody][] {
        return [...this.objects];
    }

    private getRigidBodies(): Ammo.btRigidBody[] {
        return [...this.objects.values()];
    }
} 