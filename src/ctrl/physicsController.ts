import * as THREE from 'three';
import Ammo from 'ammojs-typed';
import { AmmoSingleton } from '../setup/ammoSingleton';

function createBoxShape(object: THREE.Object3D): Ammo.btBoxShape {
    const Ammo = AmmoSingleton.get();

    const bbox = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const halfExtents = new Ammo.btVector3(size.x / 2, size.y / 2, size.z / 2);
    const shape = new Ammo.btBoxShape(halfExtents);

    return shape;
}

function createBody(object: THREE.Object3D, mass: number): Ammo.btRigidBody {
    const Ammo = AmmoSingleton.get();
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(
        object.position.x,
        object.position.y,
        object.position.z
    ));

    const motionState = new Ammo.btDefaultMotionState(transform);
    const shape = createBoxShape(object);
    const localInertia = new Ammo.btVector3(0, 0, 0);
    if (mass > 0) shape.calculateLocalInertia(mass, localInertia);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    return new Ammo.btRigidBody(rbInfo);
}

export interface PhysicsData {
    body: Ammo.btRigidBody;
    mass: number;
}

export class PhysicsController {

    objects: Map<THREE.Object3D, PhysicsData> = new Map();

    public addObject(object: THREE.Object3D, mass: number): void {
        const body = createBody(object, mass);
        this.objects.set(object, { body: body, mass: mass });
    }

    public getPhysicsData(): [THREE.Object3D, PhysicsData][] {
        return Array.from(this.objects.entries());
    }


    update(): void {
        Array.from(this.objects.entries())
            .filter(([_, data]) => data.mass !== 0)
            .forEach(([object, data]) => this.applyPhysics(data, object));
    }

    private getWorldTransform(body: Ammo.btRigidBody): Ammo.btTransform {
        const Ammo = AmmoSingleton.get();
        const transform = new Ammo.btTransform();
        body.getMotionState().getWorldTransform(transform);
        return transform;
    }

    private applyPhysics(data: PhysicsData, object: THREE.Object3D): void {
        const transform = this.getWorldTransform(data.body);
        const origin = transform.getOrigin();
        object.position.set(origin.x(), origin.y(), origin.z());
        const rotation = transform.getRotation();
        object.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
    }

    applyImpulse(force: THREE.Vector3, relativePosition?: THREE.Vector3): void {
        const Ammo = AmmoSingleton.get();
        const impulse = new Ammo.btVector3(force.x, force.y, force.z);
        const relPos = relativePosition
            ? new Ammo.btVector3(relativePosition.x, relativePosition.y, relativePosition.z)
            : new Ammo.btVector3(0, 0, 0);

        Array.from(this.objects.entries())
            .filter(([_, data]) => data.mass !== 0)
            .forEach(([_, data]) => data.body.applyImpulse(impulse, relPos));
    }
}
