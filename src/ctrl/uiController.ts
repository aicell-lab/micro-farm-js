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
import { ArmEvent } from './armCommandUI';
import { ArmCommandUI, ArmCommandUIConfig } from './armCommandUI';

function createArmCommandUIConfig(): ArmCommandUIConfig {
    const armCommandConfig: ArmCommandUIConfig = {
        commandButtons: {
            btn1: ArmCommand.GOTO_1,
            btn2: ArmCommand.GOTO_2,
            btn3: ArmCommand.GOTO_3,
            btn4: ArmCommand.GOTO_4,
            btn5: ArmCommand.GOTO_5,
            btn6: ArmCommand.GOTO_6,
        },
        syncButton: document.getElementById("sync-button")!,
        syncButtonReal: document.getElementById("sync-button-real")!,
        stopButton: document.getElementById("btn7")!,
    };
    return armCommandConfig;
}

interface HUDUIConfig {
    hud: HTMLElement;
    info: HTMLElement;
}

function createHUDUIConfig(): HUDUIConfig {
    const infoElement = document.getElementById("ui")!;
    const hudElement = document.getElementById("hud")!;
    return { hud: hudElement, info: infoElement };
}

export interface DialogEvent {
    toggleVisibility: boolean;
    opticsID: number;
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
    private entities: EntityCollection;
    private tableController: TableController;
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private ui: HUDUIConfig;
    private dialogEvent: DialogEvent;

    constructor(camera: THREE.PerspectiveCamera, entities: EntityCollection, tableController: TableController) {
        this.ui = createHUDUIConfig();
        this.camera = camera;
        this.tableController = tableController;
        this.entities = entities;
        this.armCommandUI = new ArmCommandUI(createArmCommandUIConfig());
        this.dialogEvent = { toggleVisibility: false, opticsID: -1 };
    }

    public update(input: Input, dialogVisible: boolean): void {
        if (!dialogVisible) {
            this.updateSpatialUI();
            this.updateToolTip(input.keys);
        }
        this.handleMouse(input.mouse);
    }

    public getArmEvent(): ArmEvent {
        return this.armCommandUI.getArmEvent();
    }

    public hasDialogEvent(): boolean {
        return this.dialogEvent.opticsID != -1;
    }

    public getDialogEvent(): DialogEvent {
        const clonedEvent: DialogEvent = { ...this.dialogEvent };
        this.dialogEvent = { toggleVisibility: false, opticsID: -1 };
        return clonedEvent;
    }

    private updateToolTip(keys: KeyboardInput): void {
        if (keys.pressed.has("h")) {
            this.ui.info.classList.toggle("hidden");
        }
    }

    private toggleHUD(visible: boolean): void {
        this.ui.hud.classList.toggle("hidden", !visible);
    }

    private getClosestOpticalControllerInRange(): OpticsController | null {
        const MAX_DISTANCE = 9999.9;
        const VISIBILITY_DISTANCE = 2.0;

        let minDist = MAX_DISTANCE;
        let minDistCtrl: OpticsController | null = null;

        for (const ctrl of this.tableController.getOpticalControllers()) {
            ctrl.selectBox.setVisible(false);
            ctrl.selectBox.update();
            const dist = ctrl.getDistanceScalar(this.entities.getActors().player);

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
        const intersectedMesh = this.getIntersectedMesh(mouse, this.getVisibleMeshes(table));
        if (intersectedMesh && mouse.pressed.has(MouseButton.LEFT)) {
            this.onOpticsBoxClick();
        }
        this.updateMouseUIState(table, intersectedMesh);
    }

    private onOpticsBoxClick(): void {
        let ctrl = this.getHoveredOpticsController();
        if (ctrl) {
            this.dialogEvent = { opticsID: ctrl.getID(), toggleVisibility: true };
        }
    }

}