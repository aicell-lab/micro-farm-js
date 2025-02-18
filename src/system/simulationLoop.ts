import { PhysicsWorld } from './physicsWorld';
import * as THREE from 'three';
import { Room, Actors, EntityCollection } from '../setup/entityCollection';


export function simPhysicsStep(world: PhysicsWorld, entities: EntityCollection, dt: number): void {
    let room = entities.getRoom();
    let stepDT = dt / 40.0;
    world.step(stepDT);
    room.cube.physicsController?.updateFromPhysics(room.cube.object);
}

export class SimulationLoop {
    private entities: EntityCollection;
    private world: PhysicsWorld;

    constructor(entities: EntityCollection, world: PhysicsWorld) {
        this.entities = entities;
        this.world = world;
        this.initPhysics();
    }

    private initPhysics(): void {
        let room = this.entities.getRoom();
        room.cube.physicsController?.applyImpulse(new THREE.Vector3(4.5, 0, 0));
    }

    step(dt: number): void {
        simPhysicsStep(this.world, this.entities, dt);
    }
} 