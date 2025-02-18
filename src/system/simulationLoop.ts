import { Room } from '../setup/entityCollection';
import { Actors } from '../setup/entityCollection';
import { PhysicsWorld } from './physicsWorld';
import * as THREE from 'three';

interface SimState {
    actors: Actors;
    room: Room;
}

export function simPhysicsStep(state: SimState, delta: number): void {
    //state.actors.table.update(delta);
}

export class SimulationLoop {
    private room: Room;
    private actors: Actors;
    private world: PhysicsWorld;

    constructor(room: Room, actors: Actors, world: PhysicsWorld) {
        this.room = room;
        this.actors = actors;
        this.world = world;
        this.initPhysics();
    }

    private initPhysics(): void {
        this.room.cube.physicsController?.applyImpulse(new THREE.Vector3(4.5, 0, 0));
    }

    getSimState(): SimState {
        return { actors: this.actors, room: this.room }
    }

    step(dt: number): void {
        simPhysicsStep(this.getSimState(), dt);
        this.world.step(dt / 40.0);
        this.room.cube.physicsController?.updateFromPhysics(this.room.cube.object);
    }
} 