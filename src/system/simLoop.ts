import { FrameTime } from '../types/frameTime';
import * as THREE from 'three';
import { SceneSetup } from '../setup/room';
import { RoomActors } from '../setup/actor';
import { SimState } from './simState';
import { RenderController } from './renderController';

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
    private sceneSetup: SceneSetup;
    private actors: RoomActors;
    private renderController: RenderController;

    constructor(sceneSetup: SceneSetup, actors: RoomActors, renderController: RenderController) {
        this.frameTime = getFrameTime();
        this.sceneSetup = sceneSetup;
        this.actors = actors;
        this.renderController = renderController
    }

    getSimState(): SimState {
        return { actors: this.actors, sceneSetup: this.sceneSetup }
    }

    step(): void {
        const state = this.getSimState();
        const updatedFrameTime = getFrameTime(this.frameTime);
        simPhysicsStep(state, this.frameTime);
        this.renderController.render();
        this.frameTime = updatedFrameTime
    }
} 