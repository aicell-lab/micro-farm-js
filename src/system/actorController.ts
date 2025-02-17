import { PlayerController } from '../entity/playerController';
import { InputListener } from '../io/input';
import { Actors } from '../setup/room';

export class ActorController {

    private actors: Actors;
    private inputListener: InputListener;
    private playerController: PlayerController;

    constructor(actors: Actors, inputListener: InputListener, playerController: PlayerController) {
        this.actors = actors;
        this.inputListener = inputListener;
        this.playerController = playerController;
    }

    handleUserInput() {
        this.inputListener.getPlayerActions().forEach(action => {
            action.execute(this.actors.player, this.playerController);
        });
        this.inputListener.getArmCommands().forEach(command => {
            this.actors.table.armController?.handleArmCommand(command);
        });
    }

}