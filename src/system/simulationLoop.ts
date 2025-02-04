import { Room } from '../setup/room';
import { RoomActors } from '../actor/roomActors';
import { PhysicsWorld } from './physicsWorld';

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
    }

    getSimState(): SimState {
        return { actors: this.actors, room: this.room }
    }

    step(dt: number): void {
        simPhysicsStep(this.getSimState(), dt);
        this.world.step(dt);
        this.room.cube.updateFromPhysics();
    }
} 