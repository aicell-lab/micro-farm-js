import * as THREE from 'three';
import { Room } from '../setup/room';
import { Actors } from '../setup/room';

export async function initHTMLUI() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key.toLowerCase() === "h") {
            const uiElement = document.getElementById("ui");
            if (uiElement) {
                uiElement.classList.toggle("hidden");
            }
        }
    });
}


export class UIController {

    private camera: THREE.PerspectiveCamera;
    private room: Room;
    private actors: Actors;

    constructor(camera: THREE.PerspectiveCamera, room: Room, actors: Actors) {
        this.camera = camera;
        this.room = room;
        this.actors = actors;
    }

    public updateHUD(): void {
        // TODO: implement
    }

    public updateDiegeticUI(): void {
        this.room.cube.updateNameplate(this.camera);
    }

}
