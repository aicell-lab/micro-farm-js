import { URDFLink } from 'urdf-loader';
import * as THREE from 'three';
import { OpticsState } from '../setup/enums';
//import { createBubbleStatus } from './nameplate';


export class OpticsController {
    microscope: URDFLink;
    bubbleMesh: THREE.Mesh;
    state: OpticsState = OpticsState.STANDBY;

    constructor(microscope: URDFLink, bubbleMesh: THREE.Mesh) {
        this.microscope = microscope;
        this.bubbleMesh = bubbleMesh;

        this.bubbleMesh.position.copy(new THREE.Vector3(-1.8, 1.5, 0.8));

    }

    update(_dt: number): void {
        this.bubbleMesh.position.copy(this.microscope.position).add(new THREE.Vector3(0, 1, 0));
    }

    /*public rotateBubbles(camera: THREE.PerspectiveCamera) {
        const bubblePosition = this.bubbleMesh.position;
        const cameraPosition = camera.position.clone();
        cameraPosition.y = bubblePosition.y;
        this.bubbleMesh.lookAt(cameraPosition);
    }*/

    /*private setStandbyBubble(): void {
    }*/

    /*private updateStatusBubble(state: OpticsState): void {
        switch (state) {
            case OpticsState.STANDBY:
                return this.setStandbyBubble();
            case OpticsState.CAPTURING:
                return this.setStandbyBubble();
            case OpticsState.ERROR:
                return this.setStandbyBubble();
            case OpticsState.LOADING:
                return this.setStandbyBubble();
        }
    }*/

    // update --> check if new state --> if new state update bubble
    // if inactive have no bubble

}

