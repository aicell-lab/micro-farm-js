import { Actor } from './actor';
import { SceneSetup } from '../types/setup';
import { FrameTime } from '../types/frameTime';
import { Action } from '../types/action';

export interface SimState {
    actor: Actor;
    sceneSetup: SceneSetup;
}

export function simPhysicsStep(state: SimState, frameTime: FrameTime): void {
    state.actor.update(frameTime.delta);
}

function getFrameTime(prevFrameTime?: FrameTime): FrameTime {
    const timestamp = performance.now();
    const delta = prevFrameTime ? (timestamp - prevFrameTime.timestamp) / 1000.0 : 0;
    return { delta, timestamp };
}

function applyAction(state: SimState, playerAction: Action): void {
    if (playerAction) {
        playerAction.execute(state.actor);
    }
}

function render(setup: SceneSetup): void {
    setup.renderer.render(setup.scene, setup.cameraSetup.camera);
}

export class SimulationLoop {
    private frameTime: FrameTime;
    private sceneSetup: SceneSetup;
    private actor: Actor;

    constructor(sceneSetup: SceneSetup, actor: Actor) {
        this.frameTime = getFrameTime();
        this.sceneSetup = sceneSetup;
        this.actor = actor;
    }

    getSimState(): SimState {
        return { actor: this.actor, sceneSetup: this.sceneSetup }
    }

    step(action: Action): void {
        const state = this.getSimState();
        const updatedFrameTime = getFrameTime(this.frameTime);
        applyAction(state, action);
        simPhysicsStep(state, this.frameTime);
        render(this.sceneSetup);
        this.frameTime = updatedFrameTime
    }
} 