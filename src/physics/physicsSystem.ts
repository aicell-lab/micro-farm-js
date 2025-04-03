import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import { URDFLink } from 'urdf-loader';
import { ArmJoints } from '../setup/enums';
import { Entity } from '../entity/entity';
import { JointsSync } from '../entity/armSync';

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

    constructor(entities: EntityCollection) {
        this.entities = entities;
        this.initializePhysics();
    }

    private initializePhysics(): void {
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
} 
