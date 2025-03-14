import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import { ArmCommand, UIState } from '../setup/enums';
import { Entity } from '../entity/entity';
import { TableController } from './tableController';
import { OpticsController } from './opticsController';
import { MouseInput } from '../io/mouse';
import { KeyboardInput } from '../io/keyboard';
import { Input } from '../io/input';
import { MouseButton } from '../setup/enums';

/*interface SyncCommand {
    cmd: string;
    rel: number;
    j0: number;
    j1: number;
    j2: number;
    j3: number;
    j4: number;
    vel: number;
    accel: number;
    jerk: number;
}

function getMockSyncJSON(): SyncCommand {
    return {
        cmd: "jmove",
        rel: 0,
        j0: 0,
        j1: 106.45752,
        j2: -116.608887,
        j3: -79.49707,
        j4: 0.65918,
        vel: 20,
        accel: 200,
        jerk: 1000
    };
}*/

export class ArmCommandUI {
    private actionQueue: Array<ArmCommand> = [];

    constructor() {
        this.initButtons();
    }

    private initButtons(): void {
        const commands: { id: string; command: ArmCommand }[] = [
            { id: "btn1", command: ArmCommand.GOTO_1 },
            { id: "btn2", command: ArmCommand.GOTO_2 },
            { id: "btn3", command: ArmCommand.GOTO_3 },
            { id: "btn4", command: ArmCommand.GOTO_4 },
            { id: "btn5", command: ArmCommand.GOTO_5 },
            { id: "btn6", command: ArmCommand.GOTO_6 },
        ];

        commands.forEach(({ id, command }) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener("click", () => this.queueCommand(command));
            }
        });

        const btnStop = document.getElementById("btn7");
        if (btnStop) btnStop.addEventListener("click", () => this.armStop());

        const syncButton = document.getElementById("sync-button");
        if (syncButton) {
            syncButton.addEventListener("click", () => { this.onSync(); });
        }
    }

    private onSync(): void {
        console.log("Sync...");
        //{"cmd":"jmove","rel":0,"j0":0,"j1":106.45752,"j2":-116.608887,"j3":-79.49707,"j4":0.65918,"vel":20,"accel":200,"jerk":1000}
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
}

export class DialogController {
    private dialog: HTMLElement | null;
    private dialogTitle: HTMLElement | null;
    private dialogMessage: HTMLElement | null;
    private dialogClose: HTMLElement | null;

    constructor() {
        this.dialog = document.getElementById("dialog");
        this.dialogTitle = document.getElementById("dialog-title");
        this.dialogMessage = document.getElementById("dialog-message");
        this.dialogClose = document.getElementById("dialog-close");
        this.dialogClose?.addEventListener("click", () => this.hideDialog());
    }

    public isDialogVisible(): boolean {
        return this.dialog !== null && !this.dialog.classList.contains("dialog-hidden");
    }

    public showDialog(title: string, message: string): void {
        if (this.dialog && this.dialogTitle && this.dialogMessage) {
            this.dialogTitle.textContent = title;
            this.dialogMessage.textContent = message;
            this.dialog.classList.remove("dialog-hidden");
        }
    }

    public hideDialog(): void {
        if (this.dialog) {
            this.dialog.classList.add("dialog-hidden");
        }
    }
}


/*
Types of UI
Diegetic UI – Exists within the world and can be seen by characters (e.g., in-game screens, holographic displays).
Non-diegetic (Extradiegetic) UI – Exists outside the world and is only visible to the user (e.g., minimaps, crosshairs, Heads-Up Display (HUD)).
Spatial UI – 3D UI elements that are anchored to objects but aren’t "physically" part of the world (e.g., floating nameplates in MMORPGs).
Meta UI – UI that represents abstract information but is stylized to fit the environments theme (e.g., rain on screen for weather).
*/
export class UIController {
    private camera: THREE.Camera;
    private armCommandUI: ArmCommandUI;
    private player: Entity;
    private entities: EntityCollection;
    private tableController: TableController;
    private raycaster: THREE.Raycaster = new THREE.Raycaster();

    private dialogController: DialogController;

    constructor(camera: THREE.PerspectiveCamera, entities: EntityCollection, tableController: TableController) {
        this.camera = camera;
        this.tableController = tableController;
        this.entities = entities;
        this.armCommandUI = new ArmCommandUI();
        this.player = entities.getActors().player;
        this.dialogController = new DialogController();
    }

    public update(input: Input): void {
        if (!this.dialogController.isDialogVisible()) {
            this.updateSpatialUI();
        }
        this.handleMouse(input.mouse);
        if (!this.dialogController.isDialogVisible()) {
            this.updateToolTip(input.keys);
        }
    }

    public getArmCommands(): Array<ArmCommand> {
        return this.armCommandUI.getAndClearQueue();
    }

    private updateToolTip(keys: KeyboardInput): void {
        const uiElement = document.getElementById("ui");
        if (!uiElement) return;
        if (keys.pressed.has("h")) {
            uiElement.classList.toggle("hidden");
        }
    }

    private toggleHUD(visible: boolean) {
        const hudElement = document.getElementById("hud");
        if (hudElement) {
            hudElement.classList.toggle("hidden", !visible);
        }
    }

    private getClosestOpticalControllerInRange(): OpticsController | null {
        const MAX_DISTANCE = 9999.9;
        const VISIBILITY_DISTANCE = 2.0;

        let minDist = MAX_DISTANCE;
        let minDistCtrl: OpticsController | null = null;

        for (const ctrl of this.tableController.getOpticalControllers()) {
            ctrl.selectBox.setVisible(false);
            ctrl.selectBox.update();
            const dist = ctrl.getDistanceScalar(this.player);

            if (dist < VISIBILITY_DISTANCE && dist < minDist) {
                minDistCtrl = ctrl;
                minDist = dist;
            }
        }
        return minDistCtrl;
    }

    private updateSpatialUI(): void {
        const closestController = this.getClosestOpticalControllerInRange();
        this.toggleHUD(closestController !== null);
        if (closestController) {
            closestController.selectBox.setVisible(true);
        }
    }

    private getVisibleMeshes(table: Entity): THREE.Mesh[] {
        return table.selectBoxes
            .filter(selectBox => selectBox.isVisible())
            .map(selectBox => selectBox.getMesh());
    }

    private getIntersectedMesh(mouse: MouseInput, meshes: THREE.Mesh[]): THREE.Object3D | null {
        const mouseCoords = new THREE.Vector2(mouse.x, mouse.y);
        this.raycaster.setFromCamera(mouseCoords, this.camera);
        const intersects = this.raycaster.intersectObjects(meshes);
        return intersects.length > 0 ? intersects[0].object : null;
    }

    private updateMouseUIState(table: Entity, intersectedMesh: THREE.Object3D | null): void {
        table.selectBoxes.forEach(selectBox => selectBox.setState(UIState.DEFAULT));
        if (intersectedMesh) {
            const selectBox = table.selectBoxes.find(sb => sb.getMesh() === intersectedMesh);
            if (selectBox) {
                selectBox.setState(UIState.HOVER);
            }
        }
    }

    private getHoveredOpticsController(): OpticsController | null {
        const table = this.entities.getActors().table;
        const selectBox = table.selectBoxes.find(sb => sb.getState() === UIState.HOVER) || null;
        if (selectBox) {
            const opticsController = this.tableController.getOpticsControllerBySelectBox(selectBox);
            if (opticsController) {
                return opticsController;
            }
        }
        return null;
    }

    private handleMouse(mouse: MouseInput): void {
        const table = this.entities.getActors().table;
        const meshes = this.getVisibleMeshes(table);
        const intersectedMesh = this.getIntersectedMesh(mouse, meshes);
        this.updateMouseUIState(table, intersectedMesh);

        if (mouse.pressed.has(MouseButton.LEFT) && intersectedMesh) {
            let ctrl = this.getHoveredOpticsController();
            this.dialogController.showDialog("Microscope Info", `Microscope #${ctrl?.getID()}`);
        }
    }

}