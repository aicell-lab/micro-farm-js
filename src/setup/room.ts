import { Entity } from "../entity/entity";

export interface Room {
    floor: Entity;
    cube: Entity;
}

export interface Actors {
    player: Entity;
    table: Entity;
}

