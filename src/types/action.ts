import { ActionPayload, ActionType } from "./actionType";
import { Actor } from "../setup/actor";

export class Action {
    private action: ActionPayload;

    constructor(action: ActionPayload) {
        this.action = action;
    }

    execute(actor: Actor) {
        switch (this.action.type) {
            case ActionType.MOVE:
                actor.handleMove(this.action.payload);
                break;
        }
    }
}

