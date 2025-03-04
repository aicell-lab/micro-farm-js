import { PhysicsWorld } from './physicsWorld';
import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import { PhysicsController } from '../ctrl/physicsController';


function createPhysicsController(entities: EntityCollection): PhysicsController {
    let room = entities.getRoom();
    let ctrl = new PhysicsController();
    ctrl.addObject(room.cube.object, 1.0);
    ctrl.addObject(room.floor.object, 0.0);
    ctrl.applyImpulse(new THREE.Vector3(4.5, 0, 0));
    return ctrl;
}

export class PhysicsSystem {
    private entities: EntityCollection;
    private world: PhysicsWorld;
    private physicsCtrl: PhysicsController;

    constructor(entities: EntityCollection, world: PhysicsWorld) {
        this.entities = entities;
        this.world = world;
        this.physicsCtrl = createPhysicsController(this.entities);
        this.world.addRigidBodies(this.physicsCtrl.getMeshRigidBodyPairs());
    }

    public step(dt: number): void {
        let slowedDT = dt / 10.0;
        this.world.step(slowedDT);
    }

    private getSimulatedObjects(): Array<THREE.Object3D> {
        const cube = this.entities.getRoom().cube;
        const cubeObj = cube.object;
        return [cubeObj];
    }

    private syncObject(object: THREE.Object3D): void {
        const [origin, rotation] = this.physicsCtrl.getPositionRotation(object);
        object.position.set(origin.x, origin.y, origin.z);
        object.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    }

    public syncGraphics(): void {
        this.getSimulatedObjects().forEach((object) => {
            this.syncObject(object);
        });
    }


} 