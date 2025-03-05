import { Action } from '../types/action';
import { MovePayload, ActionPayload, RotatePayload } from '../types/actionType';
import { Actions } from '../setup/enums';
import { KeyboardInput } from './keyboard';
import { Input } from './input';

export namespace ActionProcessor {
    export function getMoveAction(keyboardInput: KeyboardInput): Action {
        const dir: MovePayload = {
            forward: keyboardInput.held.has("ArrowUp") || keyboardInput.held.has("w"),
            backward: keyboardInput.held.has("ArrowDown") || keyboardInput.held.has("s"),
            left: keyboardInput.held.has("ArrowLeft") || keyboardInput.held.has("a"),
            right: keyboardInput.held.has("ArrowRight") || keyboardInput.held.has("d"),
        };
        const actionPayload: ActionPayload = { type: Actions.PLAYER_MOVE, payload: dir };
        return new Action(actionPayload);
    }

    export function getRotateAction(input: Input): Action {
        const dx = input.mouse.pointerLocked ? input.mouse.dx : 0;
        const rot: RotatePayload = {
            left: input.keys.held.has("q"),
            right: input.keys.held.has("e"),
            dx: dx,
        };
        const actionPayload: ActionPayload = { type: Actions.PLAYER_ROTATE, payload: rot };
        return new Action(actionPayload);
    }

    export function getPlayerActions(input: Input): Action[] {
        return [
            getMoveAction(input.keys),
            getRotateAction(input),
        ];
    }
}
