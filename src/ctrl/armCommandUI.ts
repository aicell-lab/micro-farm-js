import { ArmCommand } from '../setup/enums';
import { fetchArmSyncFromAPI, JointsSync, convertToJointsSync } from '../entity/armSync';

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
    private realBasePositionScaled: number = 0;
    private realJointSync: JointsSync;
    private actionQueue: Array<ArmCommand> = [];
    private isSyncing = false;
    private config: ArmCommandUIConfig;

    constructor(config: ArmCommandUIConfig) {
        this.config = config;
        this.initButtons();
        this.realJointSync = { j0: 0, j1: 0, j2: 0, j3: 0, j4: 0 };
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
        this.queueCommand(ArmCommand.SYNC);
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
            this.realJointSync = convertToJointsSync(data);
            this.realBasePositionScaled = getScaledPositionValue(extractPosition(data));
            this.queueCommand(ArmCommand.SYNC_REAL);
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
        this.actionQueue.push(command);
    }

    private armStop() {
        console.log("armStop command");
        this.actionQueue.push(ArmCommand.STOP);
    }

    public getAndClearQueue(): Array<ArmCommand> {
        const queue = [...this.actionQueue];
        this.actionQueue = [];
        return queue;
    }

    public getArmRealJointSync(): JointsSync {
        return this.realJointSync;
    }

    public getArmRealBasePositionScaled(): number {
        return this.realBasePositionScaled;
    }
}
