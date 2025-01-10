import { FrameTime } from '../types/frameTime';
import { Room } from '../setup/room';
import { RoomActors } from '../setup/actor';
import { RenderController } from './renderController';

interface SimState {
    actors: RoomActors;
    room: Room;
}

export function simPhysicsStep(state: SimState, frameTime: FrameTime): void {
    state.actors.player.update(frameTime.delta);
}

function getFrameTime(prevFrameTime?: FrameTime): FrameTime {
    const timestamp = performance.now();
    const delta = prevFrameTime ? (timestamp - prevFrameTime.timestamp) / 1000.0 : 0;
    return { delta, timestamp };
}

export class SimulationLoop {
    private frameTime: FrameTime;
    private room: Room;
    private actors: RoomActors;
    private renderController: RenderController;

    constructor(room: Room, actors: RoomActors, renderController: RenderController) {
        this.frameTime = getFrameTime();
        this.room = room;
        this.actors = actors;
        this.renderController = renderController
    }

    getSimState(): SimState {
        return { actors: this.actors, room: this.room }
    }

    step(): void {
        const updatedFrameTime = getFrameTime(this.frameTime);
        simPhysicsStep(this.getSimState(), this.frameTime);
        this.renderController.render();
        this.frameTime = updatedFrameTime
    }
} 