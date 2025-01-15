import { Actor, Human, RoomActors } from "./actor";
import * as THREE from 'three';
import { FLOOR_Y_POSITION } from "./constants";

function setActorPosition(actor: Actor) {
    const boundingBox = new THREE.Box3().setFromObject(actor.mesh);
    const minY = boundingBox.min.y;
    if (minY < FLOOR_Y_POSITION) {
        actor.mesh.position.y -= minY;
    }
}

export class ActorFactory {

    constructor() {

    }

    createHuman(): Human {
        let human = new Human();
        setActorPosition(human);
        return human;
    }

    createActors(): RoomActors {
        return { player: this.createHuman() };
    }
}
