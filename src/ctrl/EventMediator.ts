import { TableController } from './tableController';
import { PlayerController } from './playerController';
import { Actors } from '../setup/entityCollection';
import { ActionProcessor } from '../io/actionProcessor';
import { Input } from '../io/input';
import { ArmCommand } from '../setup/enums';
import { PhysicsSystem } from '../physics/physicsSystem';
import { getJointsSync } from '../entity/armSync';
import { ArmEvent } from './uiController';

export class EventMediator {

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

    public processActions(input: Input, armEvent: ArmEvent): void {
        this.processPlayerActions(input);
        this.processArmCommands(armEvent);
    }

    private processPlayerActions(input: Input): void {
        const playerActions = ActionProcessor.getPlayerActions(input);
        for (const action of playerActions) {
            action.execute(this.actors.player, this.playerController);
        }
    }

    private processArmCommands(armEvent: ArmEvent): void {
        for (const command of armEvent.commands) {
            switch (command) {
                case ArmCommand.SYNC:
                    this.physicsSystem.syncJoints(getJointsSync());
                    break;

                case ArmCommand.SYNC_REAL:
                    this.physicsSystem.syncJoints(armEvent.jointSync);
                    this.tableController.setArmBasePositionScaled(armEvent.basePositionScaled);
                    break;

                default:
                    this.tableController.handleArmCommand(command);
            }
        }
    }

}
