import { KeyboardInput } from './keyboard';
import { MouseInput } from './mouse';

export interface Input {
    keys: KeyboardInput;
    mouse: MouseInput;
}

