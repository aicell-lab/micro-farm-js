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


interface ArmPose {
    joints: JointsSync,
    basePosition: number,
}

interface ArmTransition {
    from: ArmPose,
    to: ArmPose,
    speed: number,
}

/*function toArmPose(joints: JointsSync, basePosition: number): ArmPose {
    return { joints: joints, basePosition: basePosition };
}*/

class ArmHandle {

    private arm: Entity;

    constructor(arm: Entity) {
        this.arm = arm;
    }

    private getLinkJoint(joint: ArmJoints): URDFLink {
        const arm = this.arm;
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

    public setJointAngle(j: ArmJoints, angleDeg: number): void {
        const angleRad = THREE.MathUtils.degToRad(angleDeg);
        const link = this.getLinkJoint(j);
        const axis = this.getRotationAxis(j);
        link.rotation[axis] = angleRad;
    }

    private getRotationAxis(j: ArmJoints): 'x' | 'y' | 'z' {
        switch (j) {
            case ArmJoints.j4: return 'x';
            case ArmJoints.j0: return 'z';
            default: return 'y';
        }
    }

}

class TimeInterpolator {
    private elapsed: number = 0;
    private speed: number;

    constructor(speed: number) {
        this.speed = speed;
    }

    private getDuration(): number {
        return 1.0 / this.speed
    }

    public getInterpolationFactor(): number {
        const rawT = this.elapsed / this.getDuration();
        return THREE.MathUtils.clamp(rawT, 0, 1);
    }

    public isFinished(): boolean {
        return this.getInterpolationFactor() >= 1.0;
    }

    public update(dt: number): void {
        this.elapsed += dt;
    }
}

function interpolateArmState(from: ArmPose, to: ArmPose, t: number): ArmPose {
    const joints: JointsSync = {
        j0: THREE.MathUtils.lerp(from.joints.j0, to.joints.j0, t),
        j1: THREE.MathUtils.lerp(from.joints.j1, to.joints.j1, t),
        j2: THREE.MathUtils.lerp(from.joints.j2, to.joints.j2, t),
        j3: THREE.MathUtils.lerp(from.joints.j3, to.joints.j3, t),
        j4: THREE.MathUtils.lerp(from.joints.j4, to.joints.j4, t),
    };
    const basePosition = THREE.MathUtils.lerp(from.basePosition, to.basePosition, t);
    return { joints, basePosition };
}

class ArmAnimator {
    private transition: ArmTransition;
    private interpolator: TimeInterpolator;

    constructor(transition: ArmTransition) {
        this.transition = transition;
        this.interpolator = new TimeInterpolator(transition.speed);
    }

    public isFinished(): boolean {
        return this.interpolator.isFinished();
    }

    public getArmPose(): ArmPose {
        const { from, to } = this.transition;
        return interpolateArmState(from, to, this.interpolator.getInterpolationFactor());
    }

    public update(dt: number): void {
        this.interpolator.update(dt);
    }
}

function getExampleTransition(): ArmTransition {
    const fromPose: ArmPose = {
        joints: {
            j0: 40,
            j1: 10,
            j2: 20,
            j3: -50,
            j4: 40,
        },
        basePosition: 0,
    };

    const toPose: ArmPose = {
        joints: {
            j0: -20,
            j1: 45,
            j2: 10,
            j3: 30,
            j4: -15,
        },
        basePosition: 0,
    };

    const transition: ArmTransition = {
        from: fromPose,
        to: toPose,
        speed: 0.5,
    };

    return transition;
}

export class PhysicsSystem {
    private armHandle: ArmHandle;
    private currentAnimator: ArmAnimator | null = null;

    constructor(entities: EntityCollection) {
        this.armHandle = new ArmHandle(entities.getActors().arm);
        this.initArm();
        this.startTransition(getExampleTransition());
    }

    private initArm(): void {
        const h = this.armHandle;
        h.setJointAngle(ArmJoints.j0, 40);
        h.setJointAngle(ArmJoints.j1, 10);
        h.setJointAngle(ArmJoints.j2, 20);
        h.setJointAngle(ArmJoints.j3, -50);
        h.setJointAngle(ArmJoints.j4, 40);
    }

    public startTransition(transition: ArmTransition): void {
        this.currentAnimator = new ArmAnimator(transition);
    }

    public syncJoints(data: JointsSync): void {
        const h = this.armHandle;
        h.setJointAngle(ArmJoints.j0, data.j0);
        h.setJointAngle(ArmJoints.j1, data.j1);
        h.setJointAngle(ArmJoints.j2, data.j2);
        h.setJointAngle(ArmJoints.j3, data.j3);
        h.setJointAngle(ArmJoints.j4, data.j4);
    }

    public step(dt: number, _armBasePosition: THREE.Vector3): void {
        if (this.currentAnimator) {
            this.currentAnimator.update(dt);
            const pose = this.currentAnimator.getArmPose();
            this.syncJoints(pose.joints);
            if (this.currentAnimator.isFinished()) {
                this.currentAnimator = null;
            }
        }
    }

} 
