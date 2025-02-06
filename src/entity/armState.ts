
export enum ArmState {
    Idle,
    Moving,
}

export enum ArmCommand {
    GOTO_A,
    GOTO_B,
    STOP
}

export interface ArmTransition {
    from: ArmState;
    to: ArmState;
    command: ArmCommand;
}

function transition(state: ArmState, newCommand: ArmCommand): ArmTransition {
    switch (newCommand) {
        case ArmCommand.GOTO_A:
            return { from: state, to: ArmState.Moving, command: newCommand };
        case ArmCommand.GOTO_B:
            return { from: state, to: ArmState.Moving, command: newCommand };
        case ArmCommand.STOP:
            return { from: state, to: ArmState.Idle, command: newCommand };
        default:
            throw new Error(`Unhandled case: ${newCommand}`);
    }
}

export class ArmStateMachine {
    private state = ArmState.Idle;
    private command = ArmCommand.STOP;

    constructor() {
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
        if (this.command == ArmCommand.GOTO_A) {
            return -3.0;
        }
        else if (this.command == ArmCommand.GOTO_B) {
            return -1.0;
        }
        return 0;
    }

}

