import { TableController } from './tableController';
import { PlayerController } from './playerController';
import { Actors } from '../setup/entityCollection';
import { ActionProcessor } from '../io/actionProcessor';
import { Input } from '../io/input';
import { ArmCommand } from '../setup/enums';
import { PhysicsSystem } from '../physics/physicsSystem';
import { getJointsSync, JointsSync } from '../entity/armSync';

export class ActorController {

    private actors: Actors;
    private playerController: PlayerController;
    private tableController: TableController;
    private physicsSystem: PhysicsSystem;

    constructor(actors: Actors, playerController: PlayerController, tableController: TableController, physicsSystem: PhysicsSystem) {
        this.actors = actors;
        this.playerController = playerController;
        this.tableController = tableController;
        this.physicsSystem = physicsSystem;
    }

    public processActions(input: Input, armCommands: Array<ArmCommand>, realJointSync: JointsSync, realArmBasePositionScaled: number) {
        const playerActions = ActionProcessor.getPlayerActions(input);
        playerActions.forEach(action => {
            action.execute(this.actors.player, this.playerController);
        });
        armCommands.forEach(command => {
            this.tableController.handleArmCommand(command);
            if (command == ArmCommand.SYNC) {
                this.physicsSystem.syncJoints(getJointsSync());
            }
            if (command == ArmCommand.SYNC_REAL) {
                this.physicsSystem.syncJoints(realJointSync);
                this.tableController.setArmBasePositionScaled(realArmBasePositionScaled);
            }
        });
    }

}
