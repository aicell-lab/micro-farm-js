import { ActionPayload, Actions } from "./actionType";
import { Entity } from "../entity/entity";

export class Action {
    private action: ActionPayload;

    constructor(action: ActionPayload) {
        this.action = action;
    }

    execute(actor: Entity) {
        switch (this.action.type) {
            case Actions.PLAYER_MOVE:
                if (actor.playerController) {
                    actor.playerController.handleMove(this.action.payload);
                }
                break;
        }
    }
}

