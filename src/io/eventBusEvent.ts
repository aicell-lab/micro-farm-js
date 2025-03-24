import { ArmCommand } from "../setup/enums";
import { JointsSync } from "../entity/armSync";
import { UIEventType } from "../setup/enums";

export type UIEventMap = {
    [UIEventType.ArmCommand]: ArmCommandEvent;
    [UIEventType.ArmJointSync]: ArmJointSyncEvent;
    [UIEventType.ArmBasePosition]: ArmBasePositionEvent;
    [UIEventType.DialogToggle]: DialogEvent;
};

export interface DialogEvent {
    toggleVisibility: boolean;
    opticsID: number;
}

export interface ArmCommandEvent {
    command: ArmCommand;
}

export interface ArmJointSyncEvent {
    jointSync: JointsSync;
}

export interface ArmBasePositionEvent {
    basePositionScaled: number;
}


