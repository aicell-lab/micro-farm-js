import { TableController } from './tableController';
import { PlayerController } from './playerController';
import { Actors } from '../setup/entityCollection';
import { ActionProcessor } from '../io/actionProcessor';
import { Input } from '../io/input';
import { UIEventType } from '../setup/enums';
import { PhysicsSystem } from '../physics/physicsSystem';
import { uiEventBus } from '../io/eventBus';
import { ArmCommandEvent, ArmJointSyncEvent, ArmBasePositionEvent } from '../io/uiEvent';


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

        uiEventBus.on(UIEventType.ArmCommand, (event: ArmCommandEvent) => {
            this.tableController.handleArmCommand(event.command);
        });

        uiEventBus.on(UIEventType.ArmJointSync, (event: ArmJointSyncEvent) => {
            this.physicsSystem.syncJoints(event.jointSync);
        });

        uiEventBus.on(UIEventType.ArmBasePosition, (event: ArmBasePositionEvent) => {
            this.tableController.setArmBasePositionScaled(event.basePositionScaled);
        });
    }

    public processActions(input: Input): void {
        this.processPlayerActions(input);
        uiEventBus.processEvents();
    }

    private processPlayerActions(input: Input): void {
        ActionProcessor.getPlayerActions(input).forEach(action =>
            action.execute(this.actors.player, this.playerController)
        );
    }

}
