import { Actor } from './actor';
import { SceneSetup } from '../types/setup';
import { FrameTime } from '../types/frameTime';
import { InputListener } from '../io/input';
import * as THREE from 'three';

export interface SimState {
    actor: Actor;
    sceneSetup: SceneSetup;
    inputListener: InputListener;
    frameTime: FrameTime;
    cameraOffset: THREE.Vector3;
}

export function getFrameTime(prevFrameTime?: FrameTime): FrameTime {
    const timestamp = performance.now();
    const delta = prevFrameTime ? (timestamp - prevFrameTime.timestamp) / 1000.0 : 0;
    return { delta, timestamp };
}

function updateActor(state: SimState): void {
    state.actor.applyAction(state.inputListener.getAction());
    let cameraSetup = state.sceneSetup.cameraSetup;
    state.cameraOffset = cameraSetup.camera.position.clone().sub(state.actor.mesh.position);
    state.actor.update(state.frameTime.delta);
    cameraSetup.camera.position.copy(state.actor.mesh.position.clone().add(state.cameraOffset));
    cameraSetup.cameraCtrl.target.copy(state.actor.mesh.position);
    cameraSetup.cameraCtrl.update();
}

function renderScene(sceneSetup: SceneSetup): void {
    sceneSetup.renderer.render(sceneSetup.scene, sceneSetup.cameraSetup.camera);
}

export function simLoopStep(
    state: SimState
): FrameTime {
    const updatedFrameTime = getFrameTime(state.frameTime);
    updateActor(state);
    renderScene(state.sceneSetup);
    return updatedFrameTime;
}

