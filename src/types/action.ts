import { ActionPayload, Actions } from "./actionType";
import { Entity } from "../entity/entity";

export class Action {
    private action: ActionPayload;

    constructor(action: ActionPayload) {
        this.action = action;
    }

    execute(actor: Entity) {
        if (!actor.playerController) {
            return;
        }
        let ctrl = actor.playerController;

        switch (this.action.type) {
            case Actions.PLAYER_MOVE:
                ctrl.handleMove(this.action.payload);
                break;
            case Actions.PLAYER_ROTATE:
                ctrl.handleRotation(this.action.payload);
        }
    }
}

