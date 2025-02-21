import { URDFLink } from 'urdf-loader';
import * as THREE from 'three';
import { OpticsState } from '../setup/enums';
import { Bubble } from '../entity/bubble';
//import { createBubbleStatus } from './nameplate';


export class OpticsController {
    microscope: URDFLink;
    bubble: Bubble;
    state: OpticsState = OpticsState.STANDBY;

    constructor(microscope: URDFLink, bubble: Bubble) {
        this.microscope = microscope;
        this.bubble = bubble;
        //  xyz="-0.145539076490268 -1.09899662017959 0.107670525984125"

        //bubbleMesh.position.add(new THREE.Vector3(0, 0, 0.5));
        //this.bubbleMesh.position.copy(new THREE.Vector3(-1.8, 1.7, 0.8));
        //this.bubbleMesh.position.copy(pos);
        //this.bubbleMesh.position.copy(new THREE.Vector3(0, 0, 0.5));
    }

    adjustBubblePosition(): void {
        /*let pos = new THREE.Vector3();
        this.microscope.getWorldPosition(pos);
        pos.z = pos.z * -2.0;
        const offset = new THREE.Vector3(0, 0.7, 0.0);
        pos.add(offset);
        this.bubble.setPosition(pos);*/
    }

    update(_dt: number): void {
        //this.bubbleMesh.position.copy(new THREE.Vector3(0, 0, 0.5));
        //this.bubbleMesh.position.copy(this.microscope.position).add(new THREE.Vector3(0, 1, 0));
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

