import { Actions } from "../setup/enums";
export { Actions }

export interface MovePayload {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
}

export interface RotatePayload {
    left: boolean;
    right: boolean;
    dx: number;
}

export type ActionPayload =
    | { type: Actions.PLAYER_MOVE; payload: MovePayload }
    | { type: Actions.PLAYER_ROTATE; payload: RotatePayload };