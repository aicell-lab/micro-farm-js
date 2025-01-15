import * as THREE from 'three';
import { Room } from './room';
import { RoomActors } from './actor';

export class SceneFactory {
    private room: Room;
    private actors: RoomActors;

    constructor(room: Room, actors: RoomActors) {
        this.room = room;
        this.actors = actors;
    }

    createScene(): THREE.Scene {
        const scene = new THREE.Scene();
        createLights().forEach((light) => scene.add(light));
        this.populateScene(scene);
        return scene
    }

    private populateScene(scene: THREE.Scene): void {
        scene.add(this.actors.player.mesh);
        scene.add(this.room.floor.object);
        scene.add(this.room.opticalTable.object);
    }
}

function createLights(): THREE.Light[] {
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5).normalize();
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    return [dirLight, ambientLight];
}



