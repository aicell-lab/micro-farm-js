import { KeybindFlag } from "../setup/enums";
import { Input } from "./input";


export class BitFlag<T extends number = number> {
    private value: number = 0;

    constructor(initial?: T) {
        if (initial !== undefined) {
            this.value = initial;
        }
    }

    set(flag: T): void {
        this.value |= flag;
    }

    unset(flag: T): void {
        this.value &= ~flag;
    }

    toggle(flag: T): void {
        this.value ^= flag;
    }

    has(flag: T): boolean {
        return (this.value & flag) !== 0;
    }

    reset(): void {
        this.value = 0;
    }

    get raw(): number {
        return this.value;
    }

    set raw(val: number) {
        this.value = val;
    }
}

export class KeybindBitFlag {
    private bitFlag = new BitFlag<KeybindFlag>();

    syncState(flags: Partial<Record<KeybindFlag, boolean>>) {
        for (const [flag, active] of Object.entries(flags)) {
            const numericFlag = Number(flag) as KeybindFlag;
            if (active) {
                this.setState(numericFlag);
            } else {
                this.clearState(numericFlag);
            }
        }
    }

    private setState(flag: KeybindFlag): void {
        this.bitFlag.set(flag);
    }

    private clearState(flag: KeybindFlag): void {
        this.bitFlag.unset(flag);
    }

    public hasState(flag: KeybindFlag): boolean {
        return this.bitFlag.has(flag);
    }

}

type KeyCallback = (input: Input, bitFlag: KeybindBitFlag) => void;

export class Keybind {

    private keyCallbacks = new Map<string, KeyCallback>();
    public bitFlag = new KeybindBitFlag();

    constructor() {
    }

    register(key: string, callback: KeyCallback): void {
        this.keyCallbacks.set(key, callback);
    }

    process(input: Input): void {
        for (const key of input.keys.pressed) {
            const callback = this.keyCallbacks.get(key);
            if (callback) {
                callback(input, this.bitFlag);
            }
        }
    }

}

export const keybind = new Keybind();

