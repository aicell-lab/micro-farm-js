import { ArmState, ArmCommand } from "../setup/enums";

export interface ArmTransition {
    from: ArmState;
    to: ArmState;
    command: ArmCommand;
}

function toMoveTransition(state: ArmState, command: ArmCommand): ArmTransition {
    return {
        from: state,
        to: ArmState.Moving,
        command,
    };
}

function toStopTransition(state: ArmState, command: ArmCommand): ArmTransition {
    return {
        from: state,
        to: ArmState.Idle,
        command,
    };
}

function transition(state: ArmState, command: ArmCommand): ArmTransition {
    if (isGotoCommand(command)) {
        return toMoveTransition(state, command);
    }
    if (command === ArmCommand.STOP) {
        return toStopTransition(state, command);
    }
    throw new Error(`Unhandled command: ${command}`);
}

function isGotoCommand(command: ArmCommand): boolean {
    return command !== ArmCommand.STOP;
}

export class ArmStateMachine {
    private state = ArmState.Idle;
    private command = ArmCommand.STOP;
    private targetAngleMap: Map<ArmCommand, number>;

    constructor() {
        this.targetAngleMap = new Map([
            [ArmCommand.GOTO_1, 0.2],
            [ArmCommand.GOTO_2, 0.8],
            [ArmCommand.GOTO_3, 1.4],
            [ArmCommand.GOTO_4, 2.0],
            [ArmCommand.GOTO_5, 2.5],
            [ArmCommand.GOTO_6, 3.0],
            [ArmCommand.STOP, 0.0],
        ]);
    }

    public transition(newCommand: ArmCommand): ArmTransition {
        const { from, to, command } = transition(this.state, newCommand);
        this.state = to;
        this.command = command;
        return { from, to, command };
    }

    public getState(): ArmState {
        return this.state;
    }

    public getTargetAngle(): number {
        return this.targetAngleMap.get(this.command) || 0;
    }

}

