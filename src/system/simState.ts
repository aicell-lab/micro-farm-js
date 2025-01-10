import { RoomActors } from "../setup/actor";
import { Room } from "../setup/room";

export interface SimState {
    actors: RoomActors;
    room: Room;
}


