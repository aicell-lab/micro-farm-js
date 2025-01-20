import { Actor } from "../actor/actor";
import { Human } from "../actor/human";
import * as THREE from 'three';
import { FLOOR_Y_POSITION } from "./constants";
import { RoomActors } from "../actor/roomActors";
import { OpticalTable } from "../actor/opticalTable";
import { MathUtils } from "three";


function setActorPosition(actor: Actor) {
    const boundingBox = new THREE.Box3().setFromObject(actor.object);
    const minY = boundingBox.min.y;
    if (minY < FLOOR_Y_POSITION) {
        actor.object.position.y -= minY;
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

    createOpticalTable(): OpticalTable {
        let table = new OpticalTable();
        table.object.position.y += 0.855;
        table.object.position.x -= 2.0;
        table.object.position.z -= 0.7;
        table.object.rotation.x = MathUtils.degToRad(270.0);
        return table;
    }

    createActors(): RoomActors {
        return { player: this.createHuman(), table: this.createOpticalTable() };
    }
}


