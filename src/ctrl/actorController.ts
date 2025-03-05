import { TableController } from './tableController';
import { PlayerController } from './playerController';
import { Actors } from '../setup/entityCollection';
import { ActionProcessor } from '../io/actionProcessor';
import { Input } from '../io/input';
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

    public processActions(input: Input, armCommands: Array<ArmCommand>) {
        const playerActions = ActionProcessor.getPlayerActions(input);
        playerActions.forEach(action => {
            action.execute(this.actors.player, this.playerController);
        });
        armCommands.forEach(command => {
            this.tableController.handleArmCommand(command);
        });
    }

}
