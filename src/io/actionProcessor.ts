import { Action } from '../types/action';
import { MovePayload, RotatePayload } from '../types/actionType';
import { Actions } from '../setup/enums';
import { KeyboardInput } from './keyboard';
import { Input } from './input';


const MoveKeyMap = {
    forward: ["w", "ArrowUp"],
    backward: ["s", "ArrowDown"],
    left: ["a", "ArrowLeft"],
    right: ["d", "ArrowRight"]
} as const;

const RotateKeyMap = {
    left: ["q"],
    right: ["e"]
} as const;

function isAnyKeyHeld(held: Set<string>, keys: readonly string[]): boolean {
    return keys.some((key) => held.has(key));
}

export namespace ActionProcessor {
    export function getMoveAction(keyboardInput: KeyboardInput): Action {
        const dir: MovePayload = {
            forward: isAnyKeyHeld(keyboardInput.held, MoveKeyMap.forward),
            backward: isAnyKeyHeld(keyboardInput.held, MoveKeyMap.backward),
            left: isAnyKeyHeld(keyboardInput.held, MoveKeyMap.left),
            right: isAnyKeyHeld(keyboardInput.held, MoveKeyMap.right),
        };
        return new Action({ type: Actions.PLAYER_MOVE, payload: dir });
    }

    export function getRotateAction(input: Input): Action {
        const dx = input.mouse.pointerLocked ? input.mouse.dx : 0;
        const rot: RotatePayload = {
            left: isAnyKeyHeld(input.keys.held, RotateKeyMap.left),
            right: isAnyKeyHeld(input.keys.held, RotateKeyMap.right),
            dx,
        };
        return new Action({ type: Actions.PLAYER_ROTATE, payload: rot });
    }

    export function getPlayerActions(input: Input): Action[] {
        return [
            getMoveAction(input.keys),
            getRotateAction(input),
        ];
    }
}
