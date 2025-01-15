import { Room } from '../setup/room';
import { RoomActors } from '../setup/actor';

interface SimState {
    actors: RoomActors;
    room: Room;
}

export function simPhysicsStep(state: SimState, delta: number): void {
    state.actors.player.update(delta);
}

export class SimulationLoop {
    private room: Room;
    private actors: RoomActors;

    constructor(room: Room, actors: RoomActors) {
        this.room = room;
        this.actors = actors;
    }

    getSimState(): SimState {
        return { actors: this.actors, room: this.room }
    }

    step(delta: number): void {
        simPhysicsStep(this.getSimState(), delta);
    }
} 