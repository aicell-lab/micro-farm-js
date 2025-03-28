import { PhysicsWorld } from './physicsWorld';
import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import Ammo from 'ammojs-typed';
import { AmmoUtils } from './physicsUtil';
import { URDFLink } from 'urdf-loader';
import { ArmJoints } from '../setup/enums';
import { Entity } from '../entity/entity';
import { JointsSync } from '../entity/armSync';
//import { AmmoSingleton } from '../setup/ammoSingleton';

function getLink(mesh: THREE.Mesh): URDFLink {
    const p1 = mesh.parent
    if (!p1) {
        throw new Error("Missing parent");
    }
    const p2 = p1.parent;
    if (!p2) {
        throw new Error("Missing parent");
    }
    return p2 as URDFLink;
}

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
        this.setJointAngle(ArmJoints.j0, 40);
        this.setJointAngle(ArmJoints.j1, 10);
        this.setJointAngle(ArmJoints.j2, 20);
        this.setJointAngle(ArmJoints.j3, -50);
        this.setJointAngle(ArmJoints.j4, 40);
    }

    private getArmEntity(): Entity {
        return this.entities.getActors().arm;
    }

    private getLinkJoint(joint: ArmJoints): URDFLink {
        const arm = this.getArmEntity();
        switch (joint) {
            case ArmJoints.j0:
                return getLink(arm.getMesh("arm1")!);
            case ArmJoints.j1:
                return getLink(arm.getMesh("arm2")!);
            case ArmJoints.j2:
                return getLink(arm.getMesh("arm3")!);
            case ArmJoints.j3:
                return getLink(arm.getMesh("wrist1")!);
            case ArmJoints.j4:
                return getLink(arm.getMesh("wrist2")!);
            default:
                throw new Error("Unknown joint index");
        }
    }

    private getRotationAxis(j: ArmJoints): 'x' | 'y' | 'z' {
        switch (j) {
            case ArmJoints.j4: return 'x';
            case ArmJoints.j0: return 'z';
            default: return 'y';
        }
    }

    public setJointAngle(j: ArmJoints, angleDeg: number): void {
        const angleRad = THREE.MathUtils.degToRad(angleDeg);
        const link = this.getLinkJoint(j);
        const axis = this.getRotationAxis(j);
        link.rotation[axis] = angleRad;
    }

    public syncJoints(data: JointsSync): void {
        this.setJointAngle(ArmJoints.j0, data.j0);
        this.setJointAngle(ArmJoints.j1, data.j1);
        this.setJointAngle(ArmJoints.j2, data.j2);
        this.setJointAngle(ArmJoints.j3, data.j3);
        this.setJointAngle(ArmJoints.j4, data.j4);
    }

    public step(_dt: number, _armBasePosition: THREE.Vector3): void {
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
