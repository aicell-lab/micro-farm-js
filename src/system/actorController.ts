import { InputListener } from '../io/input';
import { RoomActors } from '../actor/roomActors';

export class ActorController {

    private actors: RoomActors;
    private inputListener: InputListener;

    constructor(actors: RoomActors, inputListener: InputListener) {
        this.actors = actors;
        this.inputListener = inputListener;
    }

    handleUserInput() {
        this.inputListener.getPlayerActions().forEach(action => {
            action.execute(this.actors.player);
        });
        this.inputListener.getArmCommands().forEach(command => {
            this.actors.table.handleArmCommand(command);
            this.inputListener.dashboardController.updateDisplay();
        });
    }

}