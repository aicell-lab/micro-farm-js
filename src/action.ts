export interface Move {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
}

export interface Action {
    move: Move;
}


