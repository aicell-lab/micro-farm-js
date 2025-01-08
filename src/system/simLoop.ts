import { Actor } from './actor';
import { SceneSetup } from '../types/setup';
import { FrameTime } from '../types/frameTime';
import { Action } from '../types/action';

export interface SimState {
    actor: Actor;
    sceneSetup: SceneSetup;
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

