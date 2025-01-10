import { RoomActors } from "../setup/actor";
import { SceneSetup } from "../setup/room";

export interface SimState {
    actors: RoomActors;
    sceneSetup: SceneSetup;
}

//TODO: take out "scene" from SimState and only use Room object
