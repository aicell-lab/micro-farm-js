import { Actions } from "../setup/enums";
export { Actions }

export interface MovePayload {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
}

export type ActionPayload =
    | { type: Actions.PLAYER_MOVE; payload: MovePayload };