import { InputListener } from '../io/input';
import { Actors } from '../setup/room';

export class ActorController {

    private actors: Actors;
    private inputListener: InputListener;

    constructor(actors: Actors, inputListener: InputListener) {
        this.actors = actors;
        this.inputListener = inputListener;
    }

    handleUserInput() {
        this.inputListener.getPlayerActions().forEach(action => {
            action.execute(this.actors.player);
        });
        this.inputListener.getArmCommands().forEach(command => {
            this.actors.table.armController?.handleArmCommand(command);
        });
    }

}