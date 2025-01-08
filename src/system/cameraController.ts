import * as THREE from 'three';
import { CameraSetup } from '../types/setup'
import { Actor } from './actor';

export class CameraController {
    private cameraOffset: THREE.Vector3;
    private actor: Actor;
    private cameraSetup: CameraSetup;

    constructor(cameraSetup: CameraSetup, actor: Actor) {
        this.cameraOffset = cameraSetup.camera.position.clone().sub(actor.mesh.position);
        this.actor = actor;
        this.cameraSetup = cameraSetup;
    }

    setOffset(): void {
        let cameraSetup = this.cameraSetup;
        this.cameraOffset = cameraSetup.camera.position.clone().sub(this.actor.mesh.position);
    }

    update(): void {
        this.cameraSetup.camera.position.copy(this.actor.mesh.position.clone().add(this.cameraOffset));
        this.cameraSetup.cameraCtrl.target.copy(this.actor.mesh.position);
        this.cameraSetup.cameraCtrl.update();
    }

}