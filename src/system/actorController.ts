import { InputListener } from '../io/input';
import { RoomActors } from '../actor/roomActors';

export class ActorController {

    private actors: RoomActors;
    private inputListener: InputListener;

    constructor(actors: RoomActors) {
        this.actors = actors;
        this.inputListener = new InputListener();
    }

    handleUserInput() {
        let actions = this.inputListener.getActions();
        actions.forEach(action => {
            action.execute(this.actors.player);
        });
    }

}