import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import { ArmCommand, UIState } from '../setup/enums';
import { Entity } from '../entity/entity';
import { TableController } from './tableController';
import { OpticsController } from './opticsController';
import { MouseInput } from '../io/mouse';
import { KeyboardInput } from '../io/keyboard';
import { Input } from '../io/input';

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

    constructor(camera: THREE.PerspectiveCamera, entities: EntityCollection, tableController: TableController) {
        this.camera = camera;
        this.tableController = tableController;
        this.entities = entities;
        this.armCommandUI = new ArmCommandUI();
        this.player = entities.getActors().player;
    }

    public update(input: Input): void {
        this.updateSpatialUI();
        this.handleMouse(input.mouse);
        this.updateToolTip(input.keys);
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

    private updateSpatialUI(): void {
        let minDist = 9999.9;
        let minDistCtrl: OpticsController | null = null;
        for (const ctrl of this.tableController.getOpticalControllers()) {
            ctrl.selectBox.setVisible(false);
            ctrl.selectBox.update();
            let dist = ctrl.getDistanceScalar(this.player);
            const visibilityDist = 2.0;
            if (dist < minDist && dist < visibilityDist) {
                minDistCtrl = ctrl;
                minDist = dist;
            }
        }

        const hudElement = document.getElementById("hud");
        if (minDistCtrl && hudElement) {
            hudElement.classList.remove("hidden");
        } else if (hudElement) {
            hudElement.classList.add("hidden");
        }

        if (minDistCtrl) {
            minDistCtrl.selectBox.setVisible(true);
        }
    }

    private handleMouse(mouse: MouseInput): void {
        let table = this.entities.getActors().table;
        let camera = this.camera;
        let raycaster = this.raycaster;
        const x = mouse.x;
        const y = mouse.y;
        const mouseCoords = new THREE.Vector2(x, y);

        raycaster.setFromCamera(mouseCoords, camera);
        table.selectBoxes.forEach(selectBox => selectBox.setState(UIState.DEFAULT));
        const meshes = table.selectBoxes.filter(selectBox => selectBox.isVisible()).map(box => box.getMesh());
        const intersects = raycaster.intersectObjects(meshes);
        if (intersects.length > 0) {
            const intersectedMesh = intersects[0].object;
            const selectBox = table.selectBoxes.find(sb => sb.getMesh() === intersectedMesh);
            if (selectBox) {
                selectBox.setState(UIState.HOVER);
            }
        }

    }

}