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
        this.inputListener.getPlayerActions().forEach(action => {
            action.execute(this.actors.player);
        });
        this.inputListener.getArmActions().forEach(action => {
            action.execute(this.actors.table);
        });
    }

}