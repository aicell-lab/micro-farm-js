import { ArmState, ArmCommand } from "../setup/enums";

export interface ArmTransition {
    from: ArmState;
    to: ArmState;
    command: ArmCommand;
}

function transition(state: ArmState, newCommand: ArmCommand): ArmTransition {
    switch (newCommand) {
        case ArmCommand.GOTO_1:
            return { from: state, to: ArmState.Moving, command: newCommand };
        case ArmCommand.GOTO_2:
            return { from: state, to: ArmState.Moving, command: newCommand };
        case ArmCommand.GOTO_3:
            return { from: state, to: ArmState.Moving, command: newCommand };
        case ArmCommand.GOTO_4:
            return { from: state, to: ArmState.Moving, command: newCommand };
        case ArmCommand.GOTO_5:
            return { from: state, to: ArmState.Moving, command: newCommand };
        case ArmCommand.GOTO_6:
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

