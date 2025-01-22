
export enum Actions {
    PLAYER_MOVE,
    ARM_BASE_MOVE,
}

export interface MovePayload {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
}

export interface AnglePayload {
    angle: number;
}

export type ActionPayload =
    | { type: Actions.PLAYER_MOVE; payload: MovePayload }
    | { type: Actions.ARM_BASE_MOVE; payload: AnglePayload };