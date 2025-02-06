import { RoomObject } from '../object/roomObject';
import { Floor } from '../object/floor';
import { Room } from './room';
import { TCube } from '../object/cube';
import { PhysicsWorld } from '../system/physicsWorld';

export class RoomObjectFactory {

    world: PhysicsWorld;

    constructor(world: PhysicsWorld) {
        this.world = world;
    }

    createFloor(): RoomObject {
        return new Floor(this.world);
    }

    createCube(): RoomObject {
        return new TCube(this.world);
    }

    createRoom(): Room {
        return {
            floor: this.createFloor(),
            cube: this.createCube()
        }
    }

}

