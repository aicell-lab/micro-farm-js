import { Room } from '../setup/room';
import { RoomActors } from '../actor/roomActors';
import { PhysicsWorld } from './physicsWorld';
import * as THREE from 'three';

interface SimState {
    actors: RoomActors;
    room: Room;
}

export function simPhysicsStep(state: SimState, delta: number): void {
    state.actors.player.update(delta);
    state.actors.table.update(delta);
}

export class SimulationLoop {
    private room: Room;
    private actors: RoomActors;
    private world: PhysicsWorld;

    constructor(room: Room, actors: RoomActors) {
        this.room = room;
        this.actors = actors;
        this.world = new PhysicsWorld();
        room.cube.addPhysics(1, this.world);
        room.floor.addPhysics(0, this.world);
        room.cube.applyImpulse(new THREE.Vector3(4.5, 0, 0));
    }

    getSimState(): SimState {
        return { actors: this.actors, room: this.room }
    }

    step(dt: number): void {
        simPhysicsStep(this.getSimState(), dt);
        this.world.step(dt/2.0);
        this.room.cube.updateFromPhysics();
    }
} 