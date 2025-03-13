import { PhysicsWorld } from './physicsWorld';
import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import Ammo from 'ammojs-typed';
import { AmmoUtils } from './physicsUtil';
//import { AmmoSingleton } from '../setup/ammoSingleton';

export class PhysicsSystem {
    private entities: EntityCollection;
    private world: PhysicsWorld;
    private rigidBodies: Map<THREE.Mesh, Ammo.btRigidBody> = new Map();
    private masses: Map<THREE.Mesh, number> = new Map();
    //private hingeConstraints: Map<THREE.Mesh, Ammo.btHingeConstraint> = new Map();

    constructor(entities: EntityCollection) {
        this.entities = entities;
        this.world = new PhysicsWorld();
        this.initializePhysics();
    }

    private initializePhysics(): void {
        const room = this.entities.getRoom();
        this.addObject(room.cube.object, 1.0);
        this.addObject(room.floor.object, 0.0);
        AmmoUtils.applyImpulse(new THREE.Vector3(4.5, 0, 0), [this.rigidBodies.get(room.cube.object as THREE.Mesh)!]);
        //this.setupArm();
    }

    /*private setupArm(): void {
        const Ammo = AmmoSingleton.get();
        const arm = this.entities.getActors().arm;
        const base = arm.getMesh("arm-base")!;
        const arm1 = arm.getMesh("arm1")!;
        const arm2 = arm.getMesh("arm2")!;
        const arm3 = arm.getMesh("arm3")!;
        const gripper = arm.getMesh("gripper")!;
        const wrist1 = arm.getMesh("wrist1")!;
        const wrist2 = arm.getMesh("wrist2")!;

        this.addObject(base, 0.0);
        this.addObject(arm1, 1.0);
        this.addObject(arm2, 1.0);
    }*/

    /*private moveStaticObjects(armBasePosition: THREE.Vector3): void {
        const Ammo = AmmoSingleton.get();
        const arm = this.entities.getActors().arm;
        const base = arm.getMesh("arm-base")!;
        const baseBody = this.rigidBodies.get(base)!;
        const transform = new Ammo.btTransform();
        baseBody.getMotionState().getWorldTransform(transform);
        const p = armBasePosition.clone();
    
        const newPos = new Ammo.btVector3(p.x, -p.z, -p.y);
        const offset = new Ammo.btVector3(-0.086, 0.017, -0.07);
        const result = newPos.op_add(offset);
        transform.setOrigin(result);

        baseBody.setWorldTransform(transform);
        baseBody.getMotionState().setWorldTransform(transform);
    }*/

    public step(dt: number, _armBasePosition: THREE.Vector3): void {
        //this.moveStaticObjects(armBasePosition);

        let slowedDT = dt / 10.0;
        this.world.step(slowedDT);

        //const time = performance.now() / 1000; // time in seconds
        //const speed = Math.sin(time) * 1.5;
        //for (const hinge of this.hingeConstraints.values()) {
        //    hinge.enableAngularMotor(true, speed * 2, 20.0);
        //}
    }

    public getRigidBodyMap(): Map<THREE.Mesh, Ammo.btRigidBody> {
        return this.rigidBodies;
    }

    private addObject(object: THREE.Object3D, mass: number): void {
        const mesh = AmmoUtils.getMesh(object);
        const body = AmmoUtils.createBody(mesh, mass);
        this.rigidBodies.set(mesh, body);
        this.masses.set(mesh, mass);
        this.world.addRigidBody(body, mesh);
    }
} 
