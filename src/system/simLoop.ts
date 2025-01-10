import { FrameTime } from '../types/frameTime';
import * as THREE from 'three';
import { getRenderer } from './window';
import { SceneSetup } from '../setup/room';
import { RoomActors } from '../setup/actor';

export interface SimState {
    actors: RoomActors;
    sceneSetup: SceneSetup;
}

export function simPhysicsStep(state: SimState, frameTime: FrameTime): void {
    state.actors.player.update(frameTime.delta);
}

function getFrameTime(prevFrameTime?: FrameTime): FrameTime {
    const timestamp = performance.now();
    const delta = prevFrameTime ? (timestamp - prevFrameTime.timestamp) / 1000.0 : 0;
    return { delta, timestamp };
}

function render(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    getRenderer().render(scene, camera);
}

export class SimulationLoop {
    private frameTime: FrameTime;
    private sceneSetup: SceneSetup;
    private actors: RoomActors;

    constructor(sceneSetup: SceneSetup, actors: RoomActors) {
        this.frameTime = getFrameTime();
        this.sceneSetup = sceneSetup;
        this.actors = actors;
    }

    getSimState(): SimState {
        return { actors: this.actors, sceneSetup: this.sceneSetup }
    }

    step(camera: THREE.PerspectiveCamera): void {
        const state = this.getSimState();
        const updatedFrameTime = getFrameTime(this.frameTime);
        simPhysicsStep(state, this.frameTime);
        render(this.sceneSetup.scene, camera);
        this.frameTime = updatedFrameTime
    }
} 