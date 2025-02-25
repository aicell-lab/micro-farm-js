import { TableController } from './tableController';
import { PlayerController } from './playerController';
import { Actors } from '../setup/entityCollection';
import { ActionProcessor } from '../io/actionProcessor';
import { KeyboardInput } from '../io/keyboard';
import { ArmCommand } from '../setup/enums';

export class ActorController {

    private actors: Actors;
    private playerController: PlayerController;
    private tableController: TableController;

    constructor(actors: Actors, playerController: PlayerController, tableController: TableController) {
        this.actors = actors;
        this.playerController = playerController;
        this.tableController = tableController;
    }

    public processActions(keys: KeyboardInput, armCommands: Array<ArmCommand>) {
        const playerActions = ActionProcessor.getPlayerActions(keys);
        playerActions.forEach(action => {
            action.execute(this.actors.player, this.playerController);
        });
        armCommands.forEach(command => {
            this.tableController.handleArmCommand(command);
        });
    }

    /*handleUserInput() {
        const keys = this.inputListener.getKeyboardInput();
        const playerActions = ActionProcessor.getPlayerActions(keys);
        playerActions.forEach(action => {
            action.execute(this.actors.player, this.playerController);
        });
        this.uiController.getArmCommands().forEach(command => {
            this.tableController.handleArmCommand(command);
        });
    }*/

}