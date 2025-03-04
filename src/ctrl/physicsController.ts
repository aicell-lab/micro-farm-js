import * as THREE from 'three';
import Ammo from 'ammojs-typed';
import { AmmoSingleton } from '../setup/ammoSingleton';

function createBoxShape(object: THREE.Mesh): Ammo.btBoxShape {
    const Ammo = AmmoSingleton.get();

    const bbox = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const halfExtents = new Ammo.btVector3(size.x / 2, size.y / 2, size.z / 2);
    const shape = new Ammo.btBoxShape(halfExtents);

    return shape;
}

function createBody(object: THREE.Mesh, mass: number): Ammo.btRigidBody {
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

function getMesh(object: THREE.Object3D): THREE.Mesh {
    if (object instanceof THREE.Mesh) {
        return object;
    }
    const mesh = object.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh | undefined;
    if (mesh) {
        return mesh;
    }
    throw new Error("No Mesh found in object");
}

export class PhysicsController {

    private objects: Map<THREE.Mesh, Ammo.btRigidBody> = new Map();
    private masses: Map<THREE.Mesh, number> = new Map();

    public addMesh(mesh: THREE.Mesh, mass: number): void {
        this.objects.set(mesh, createBody(mesh, mass));
        this.masses.set(mesh, mass);
    }

    public addObject(object: THREE.Object3D, mass: number): void {
        const mesh = getMesh(object);
        this.addMesh(mesh, mass);
    }

    public getRigidBody(object: THREE.Object3D): Ammo.btRigidBody {
        const mesh = getMesh(object);
        const body = this.objects.get(mesh);
        if (!body) throw new Error("Body not found");
        return body;
    }

    public getMeshes(): THREE.Mesh[] {
        return Array.from(this.objects.keys());
    }

    public getMeshRigidBodyPairs(): [THREE.Mesh, Ammo.btRigidBody][] {
        return Array.from(this.objects.entries()).map(([mesh, body]) => [mesh, body]);
    }

    update(): void {
        this.objects.forEach((body, object) => {
            const mass = this.masses.get(object) || 0;
            if (mass > 0) {
                this.applyPhysics(body, object);
            }
        });
    }

    private getWorldTransform(body: Ammo.btRigidBody): Ammo.btTransform {
        const Ammo = AmmoSingleton.get();
        const transform = new Ammo.btTransform();
        body.getMotionState().getWorldTransform(transform);
        return transform;
    }

    private applyPhysics(body: Ammo.btRigidBody, object: THREE.Object3D): void { //TODO: Get position, rotation pair for each mesh.
        const transform = this.getWorldTransform(body);
        const origin = transform.getOrigin();
        const rotation = transform.getRotation();
        object.position.set(origin.x(), origin.y(), origin.z());
        object.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
    }

    applyImpulse(force: THREE.Vector3): void {
        const Ammo = AmmoSingleton.get();
        const impulse = new Ammo.btVector3(force.x, force.y, force.z);
        const relPos = new Ammo.btVector3(0, 0, 0);
        this.objects.forEach((body, _) => {
            body.applyImpulse(impulse, relPos);
        });
    }
}
