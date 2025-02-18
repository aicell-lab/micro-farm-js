import { Bubble } from "../entity/bubble";
import { Entity } from "../entity/entity";

export interface Room {
    floor: Entity;
    cube: Entity;
}

export interface Actors {
    player: Entity;
    table: Entity;
}

export class EntityCollection {
    private room: Room;
    private actors: Actors;

    constructor(room: Room, actors: Actors) {
        this.room = room;
        this.actors = actors;
    }

    getEntities(): Entity[] {
        return [...Object.values(this.room), ...Object.values(this.actors)];
    }

    getBubbles(): Bubble[] {
        const entities = this.getEntities();
        const allBubbles: Bubble[] = [];
        for (const entity of entities) {
            allBubbles.push(...entity.bubbles);
        }
        return allBubbles;
    }

    getRoom(): Room {
        return this.room;
    }

    getActors(): Actors {
        return this.actors;
    }
}
