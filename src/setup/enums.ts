export enum Robots {
    OpticalTable,
    Arm
}

export enum Models {
}

export enum Textures {
    Error,
    PhotoCamera,
    Timelapse,
    Timer,
}

export enum Animations {
    Human
}

export enum ArmState {
    Idle,
    Moving,
}

export enum ArmCommand {
    GOTO_1,
    GOTO_2,
    GOTO_3,
    GOTO_4,
    GOTO_5,
    GOTO_6,
    SYNC,
    STOP,
}

export enum Actions {
    PLAYER_MOVE,
    PLAYER_ROTATE,
}

export enum OpticsState {
    ERROR,
    CAPTURING,
    STANDBY,
    LOADING
}

export enum UIState {
    DEFAULT,
    SELECTED,
    HOVER,
    DISABLED,
}

export enum MouseButton {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
}

export enum ArmJoints {
    j0 = 0,
    j1 = 1,
    j2 = 2,
    j3 = 3,
    j4 = 4,
}
