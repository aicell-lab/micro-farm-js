import { PhysicsWorld } from './physicsWorld';
import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import Ammo from 'ammojs-typed';
import { AmmoUtils } from './physicsUtil';
import { AmmoSingleton } from '../setup/ammoSingleton';

export class PhysicsSystem {
    private entities: EntityCollection;
    private world: PhysicsWorld;
    private rigidBodies: Map<THREE.Mesh, Ammo.btRigidBody> = new Map();
    private masses: Map<THREE.Mesh, number> = new Map();
    private hingeConstraints: Map<THREE.Mesh, Ammo.btHingeConstraint> = new Map();

    constructor(entities: EntityCollection) {
        this.entities = entities;
        this.world = new PhysicsWorld();
        this.initializePhysics();
    }

    private initializePhysics(): void {
        const room = this.entities.getRoom();
        this.addObject(room.cube.object, 1.0);
        this.addObject(room.floor.object, 0.0);
        AmmoUtils.applyImpulse(new THREE.Vector3(4.5, 0, 0), [...this.rigidBodies.values()]);
        this.setupArmTest();
    }

    private setupArmTest(): void {
        const Ammo = AmmoSingleton.get();
        const armTest = this.entities.getActors().armTest;
        const sliderMesh = armTest.getMesh("slider")!;
        const boxMesh = armTest.getMesh("box")!;

        this.addObject(sliderMesh, 0.0);
        this.addObject(boxMesh, 1.0);
        const sliderBody = this.rigidBodies.get(sliderMesh)!;
        const boxBody = this.rigidBodies.get(boxMesh)!;
        const hingePivotSlider = new Ammo.btVector3(1, 0, 0); // local to slider
        const hingePivotBox = new Ammo.btVector3(-0.15, 0, 0); // local to box
        const hingeAxis = new Ammo.btVector3(0, 1, 0); // Y-axis rotation

        const hinge = new Ammo.btHingeConstraint(
            sliderBody,
            boxBody,
            hingePivotSlider,
            hingePivotBox,
            hingeAxis,
            hingeAxis,
            true // useReferenceFrameA
        );

        hinge.setLimit(
            -Math.PI * 0.9,       // low limit
            Math.PI * 0.9,        // high limit
            0.9,            // softness (how soft the limit feels; 0 = hard, 1 = soft)
            0.3,            // biasFactor (how aggressively to correct limit violations)
            1.0             // relaxationFactor (how fast to bounce back)
        );



        this.world.addConstraint(hinge, true);
        this.hingeConstraints.set(boxMesh, hinge);

    }

    public step(dt: number): void {
        let slowedDT = dt / 10.0;
        this.world.step(slowedDT);

        const time = performance.now() / 1000; // time in seconds
        const speed = Math.sin(time) * 1.5;

        for (const hinge of this.hingeConstraints.values()) {
            hinge.enableAngularMotor(true, speed, 10.0);
        }
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
