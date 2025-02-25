import { Action } from '../types/action';
import { MovePayload, ActionPayload, RotatePayload } from '../types/actionType';
import { Actions } from '../setup/enums';
import { KeyboardInput } from './keyboard';

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

    export function getRotateAction(keyboardInput: KeyboardInput): Action {
        const rot: RotatePayload = {
            left: keyboardInput.held.has("q"),
            right: keyboardInput.held.has("e"),
        };
        const actionPayload: ActionPayload = { type: Actions.PLAYER_ROTATE, payload: rot };
        return new Action(actionPayload);
    }

    export function getPlayerActions(keyboardInput: KeyboardInput): Action[] {
        return [
            getMoveAction(keyboardInput),
            getRotateAction(keyboardInput),
        ];
    }
}
