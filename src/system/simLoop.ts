import { Actor } from './actor';
import { FrameTime } from '../types/frameTime';
import { Action } from '../types/action';
import { SceneSetup } from '../setup/sceneSetup';
import * as THREE from 'three';

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

function render(setup: SceneSetup, camera: THREE.PerspectiveCamera): void {
    setup.renderer.render(setup.scene, camera);
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

    step(action: Action, camera: THREE.PerspectiveCamera): void {
        const state = this.getSimState();
        const updatedFrameTime = getFrameTime(this.frameTime);
        applyAction(state, action);
        simPhysicsStep(state, this.frameTime);
        render(this.sceneSetup, camera);
        this.frameTime = updatedFrameTime
    }
} 