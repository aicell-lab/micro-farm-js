import { Actor } from './actor';
import { SceneSetup } from '../types/setup';
import { FrameTime } from '../types/frameTime';
import { Action } from '../types/action';

export interface SimState {
    actor: Actor;
    sceneSetup: SceneSetup;
}

function applyAction(state: SimState, playerAction: Action): void {
    if (playerAction) {
        playerAction.execute(state.actor);
    }
}

export function simPhysicsStep(state: SimState, frameTime: FrameTime): void {
    state.actor.update(frameTime.delta);
}

export function simLoopStep(state: SimState, frameTime: FrameTime, playerAction: Action): void {
    applyAction(state, playerAction);
    simPhysicsStep(state, frameTime);
    let setup = state.sceneSetup;
    setup.renderer.render(setup.scene, setup.cameraSetup.camera);
}

