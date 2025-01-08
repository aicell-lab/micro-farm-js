import { Actor } from './actor';
import { SceneSetup } from '../types/setup';
import { FrameTime } from '../types/frameTime';
import { Action } from '../types/action';

export interface SimState {
    actor: Actor;
    sceneSetup: SceneSetup;
}

export function getFrameTime(prevFrameTime?: FrameTime): FrameTime {
    const timestamp = performance.now();
    const delta = prevFrameTime ? (timestamp - prevFrameTime.timestamp) / 1000.0 : 0;
    return { delta, timestamp };
}

function applyAction(state: SimState, actorAction: Action): void {
    state.actor.applyAction(actorAction);
}

export function simPhysicsStep(state: SimState, frameTime: FrameTime): void {
    state.actor.update(frameTime.delta);
}

export function simLoopStep(state: SimState, frameTime: FrameTime, actorAction: Action): void {
    applyAction(state, actorAction);
    simPhysicsStep(state, frameTime);
    let setup = state.sceneSetup;
    setup.renderer.render(setup.scene, setup.cameraSetup.camera);
}

