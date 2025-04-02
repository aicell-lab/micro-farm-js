import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import { ArmCommand, KeybindFlag, UIEventType, UIState } from '../setup/enums';
import { Entity } from '../entity/entity';
import { TableController } from '../ctrl/tableController';
import { OpticsUnit } from '../entity/opticsUnit';
import { MouseInput } from '../io/mouse';
import { Input } from '../io/input';
import { MouseButton } from '../setup/enums';
import { ArmCommandUI, ArmCommandUIConfig } from '../ctrl/armCommandUI';
import { uiEventBus } from '../io/eventBus';
import { keybind, KeybindBitFlag } from '../io/keybind';
import { registerServer } from '../io/hypha';

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

function registerInfoToggle(info: HTMLElement) {
    keybind.register("h", (_input: Input, bitFlag: KeybindBitFlag) => {
        if (!bitFlag.hasState(KeybindFlag.DIALOG_VISIBLE)) {
            info.classList.toggle("hidden");
        }
    });
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
    private entities: EntityCollection;
    private tableController: TableController;
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private ui: HUDUIConfig;

    constructor(camera: THREE.PerspectiveCamera, entities: EntityCollection, tableController: TableController) {
        this.ui = createHUDUIConfig();
        this.camera = camera;
        this.tableController = tableController;
        this.entities = entities;
        new ArmCommandUI(createArmCommandUIConfig());
        registerInfoToggle(this.ui.info);
        this.registerPhysicsToggle();
        this.registerHyphaButton();
    }

    public update(input: Input): void {
        if (!keybind.bitFlag.hasState(KeybindFlag.DIALOG_VISIBLE)) {
            this.updateSpatialUI();
        }
        this.handleMouse(input.mouse);
    }

    private toggleHUD(visible: boolean): void {
        this.ui.hud.classList.toggle("hidden", !visible);
    }

    private getClosestOpticalUnitInRange(): OpticsUnit | null {
        const MAX_DISTANCE = 9999.9;
        const VISIBILITY_DISTANCE = 2.0;

        let minDist = MAX_DISTANCE;
        let minDistCtrl: OpticsUnit | null = null;

        for (const ctrl of this.tableController.getOpticsUnits()) {
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
        const closestUnit = this.getClosestOpticalUnitInRange();
        this.toggleHUD(closestUnit !== null);
        if (closestUnit) {
            closestUnit.selectBox.setVisible(true);
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

    private getHoveredOpticsUnit(): OpticsUnit | null {
        const table = this.entities.getActors().table;
        const selectBox = table.selectBoxes.find(sb => sb.getState() === UIState.HOVER) || null;
        if (selectBox) {
            const opticsUnit = this.tableController.getOpticsUnitBySelectBox(selectBox);
            if (opticsUnit) {
                return opticsUnit;
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
        let ctrl = this.getHoveredOpticsUnit();
        if (ctrl) {
            uiEventBus.queue(UIEventType.DialogToggle, { opticsID: ctrl.getID(), toggleVisibility: true });
        }
    }

    private registerPhysicsToggle(): void {
        const physicsToggle = document.getElementById("physics-toggle-checkbox") as HTMLInputElement;
        if (physicsToggle) {
            physicsToggle.addEventListener("change", () => {
                const isOn = physicsToggle.checked;
                this.onPhysicsToggle(isOn);
            });
        }
    }

    private onPhysicsToggle(enabled: boolean): void {
        console.log("Physics toggled:", enabled);
    }

    private registerHyphaButton(): void {
        const hyphaButton = document.getElementById("register-hypha-button");
        if (hyphaButton) {
            hyphaButton.addEventListener("click", () => {
                this.onHyphaRegisterClick();
            });
        }
    }

    private onHyphaRegisterClick(): void {
        console.log("Hypha registration triggered.");
        registerServer();
    }



}