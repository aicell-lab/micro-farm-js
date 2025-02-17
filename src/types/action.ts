import { ActionPayload, Actions } from "./actionType";
import { Entity } from "../entity/entity";
import { PlayerController } from "../entity/playerController";

export class Action {
    private action: ActionPayload;

    constructor(action: ActionPayload) {
        this.action = action;
    }

    execute(_: Entity, ctrl: PlayerController) {
        switch (this.action.type) {
            case Actions.PLAYER_MOVE:
                ctrl.handleMove(this.action.payload);
                break;
            case Actions.PLAYER_ROTATE:
                ctrl.handleRotation(this.action.payload);
        }
    }
}

