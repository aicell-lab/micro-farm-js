
export enum ActionType {
    MOVE
}

export interface MovePayload {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean
}

export type ActionPayload =
    | { type: ActionType.MOVE; payload: MovePayload };