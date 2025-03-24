import { ArmCommand, UIEventType } from '../setup/enums';
import { fetchArmSyncFromAPI, convertToJointsSync, getJointsSync } from '../entity/armSync';
import { uiEventBus } from '../io/eventBus';

function extractPosition(data: number[]): number {
    const REAL_JOINT_POS_MULT_CONSTANT: number = 0.26853766; // Multiply by returned value from "https://hypha.aicell.io/reef-imaging/services/robotic-arm-control/get_all_joints"
    const POSITION_INDEX = 6;
    const position_data = data[POSITION_INDEX];
    return position_data * REAL_JOINT_POS_MULT_CONSTANT;
}

function getScaledPositionValue(realBasePosition: number): number {
    const MAX_POSITION: number = 331.0; //mm
    return realBasePosition / MAX_POSITION; // Returns scaled position [0, 1]
}

export interface ArmCommandUIConfig {
    commandButtons: { [key: string]: ArmCommand };
    syncButton: HTMLElement;
    syncButtonReal: HTMLElement;
    stopButton: HTMLElement;
}

export class ArmCommandUI {
    private isSyncing = false;
    private config: ArmCommandUIConfig;

    constructor(config: ArmCommandUIConfig) {
        this.config = config;
        this.initButtons();
    }

    private initButtons(): void {
        Object.entries(this.config.commandButtons).forEach(([key, command]) => {
            const button = document.getElementById(key);
            if (button) {
                button.addEventListener("click", () => this.queueCommand(command));
            }
        });
        if (this.config.stopButton) {
            this.config.stopButton.addEventListener("click", () => this.armStop());
        }
        if (this.config.syncButton) {
            this.config.syncButton.addEventListener("click", () => this.onSync());
        }
        if (this.config.syncButtonReal) {
            this.config.syncButtonReal.addEventListener("click", () => this.onSyncReal());
        }
    }

    private onSync(): void {
        console.log("Sync...");
        uiEventBus.queue(UIEventType.ArmJointSync, { jointSync: getJointsSync() });
    }

    private async onSyncReal(): Promise<void> {
        if (this.isSyncing) return;
        this.isSyncing = true;

        const syncButtonReal = this.config.syncButtonReal;
        if (syncButtonReal) {
            syncButtonReal.classList.add("loading");
            syncButtonReal.textContent = "Syncing...";
        }

        try {
            console.log("Sync real...");
            const data = await fetchArmSyncFromAPI();
            const realJointSync = convertToJointsSync(data);
            const realBasePositionScaled = getScaledPositionValue(extractPosition(data));
            uiEventBus.queue(UIEventType.ArmJointSync, { jointSync: realJointSync });
            uiEventBus.queue(UIEventType.ArmBasePosition, { basePositionScaled: realBasePositionScaled });
        } catch (err) {
            console.error("Failed to sync:", err);
        } finally {
            this.isSyncing = false;
            if (syncButtonReal) {
                syncButtonReal.classList.remove("loading");
                syncButtonReal.textContent = "SYNC-REAL";
            }
        }
    }

    private queueCommand(command: ArmCommand) {
        console.log(`Command: ${command}`);
        uiEventBus.queue(UIEventType.ArmCommand, { command: command });
    }

    private armStop() {
        console.log("armStop command");
        uiEventBus.queue(UIEventType.ArmCommand, { command: ArmCommand.STOP });
    }

}
