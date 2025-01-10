import { RoomActors } from "./actorFactory";
import { InputListener } from '../io/input';

export class ActorController {

    private actors: RoomActors;
    private inputListener: InputListener;

    constructor(actors: RoomActors) {
        this.actors = actors;
        this.inputListener = new InputListener();
    }

    handleUserInput() {
        let action = this.inputListener.getAction();
        if (action) {
            action.execute(this.actors.player);
        }
    }

}