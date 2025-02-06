import { ActionPayload, Actions } from "./actionType";
import { Actor } from "../actor/actor";

export class Action {
    private action: ActionPayload;

    constructor(action: ActionPayload) {
        this.action = action;
    }

    execute(actor: Actor) {
        switch (this.action.type) {
            case Actions.PLAYER_MOVE:
                if (actor.playerController) {
                    actor.playerController.handleMove(this.action.payload);
                }
                break;
        }
    }
}

