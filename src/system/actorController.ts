import { ArmController } from '../entity/armController';
import { PlayerController } from '../entity/playerController';
import { InputListener } from '../io/input';
import { Actors } from '../setup/room';

export class ActorController {

    private actors: Actors;
    private inputListener: InputListener;
    private playerController: PlayerController;
    private armController: ArmController;

    constructor(actors: Actors, inputListener: InputListener, playerController: PlayerController, armController: ArmController) {
        this.actors = actors;
        this.inputListener = inputListener;
        this.playerController = playerController;
        this.armController = armController;
    }

    handleUserInput() {
        this.inputListener.getPlayerActions().forEach(action => {
            action.execute(this.actors.player, this.playerController);
        });
        this.inputListener.getArmCommands().forEach(command => {
            this.armController.handleArmCommand(command);
        });
    }

}