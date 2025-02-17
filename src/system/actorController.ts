import { TableController } from '../entity/tableController';
import { PlayerController } from '../entity/playerController';
import { InputListener } from '../io/input';
import { Actors } from '../setup/room';

export class ActorController {

    private actors: Actors;
    private inputListener: InputListener;
    private playerController: PlayerController;
    private tableController: TableController;

    constructor(actors: Actors, inputListener: InputListener, playerController: PlayerController, tableController: TableController) {
        this.actors = actors;
        this.inputListener = inputListener;
        this.playerController = playerController;
        this.tableController = tableController;
    }

    handleUserInput() {
        this.inputListener.getPlayerActions().forEach(action => {
            action.execute(this.actors.player, this.playerController);
        });
        this.inputListener.getArmCommands().forEach(command => {
            this.tableController.handleArmCommand(command);
        });
    }

}