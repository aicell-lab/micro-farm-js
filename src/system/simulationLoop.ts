import { PhysicsWorld } from './physicsWorld';
import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import { PhysicsController } from '../entity/physicsController';

export class SimulationLoop {
    private entities: EntityCollection;
    private world: PhysicsWorld;
    private physicsCtrl: PhysicsController;

    constructor(entities: EntityCollection, world: PhysicsWorld) {
        this.entities = entities;
        this.world = world;
        let room = this.entities.getRoom();
        this.physicsCtrl = new PhysicsController();
        this.physicsCtrl.addObject(room.cube.object, 1.0);
        this.physicsCtrl.addObject(room.floor.object, 0.0);
        this.physicsCtrl.applyImpulse(new THREE.Vector3(4.5, 0, 0));
        this.physicsCtrl.getPhysicsData().forEach(([object, data]) => {
            this.world.addRigidBody(data.body, object);
        });
    }

    step(dt: number): void {
        let slowedDT = dt / 10.0;
        this.world.step(slowedDT);
        this.physicsCtrl.update();
    }
} 