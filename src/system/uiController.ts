import * as THREE from 'three';
import { Room } from '../setup/room';
import { Actors } from '../setup/room';
import { ArmCommand } from '../setup/enums';

function initToolTip() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key.toLowerCase() === "h") {
            const uiElement = document.getElementById("ui");
            if (uiElement) {
                uiElement.classList.toggle("hidden");
            }
        }
    });
}

export class ArmCommandUI {
    private actionQueue: Array<ArmCommand> = [];

    constructor() {
        this.initButtons();
    }

    private initButtons(): void {
        const btnA = document.getElementById("btn1");
        const btnB = document.getElementById("btn2");
        const btnStop = document.getElementById("btn3");

        if (btnA) btnA.addEventListener("click", () => this.armGotoA());
        if (btnB) btnB.addEventListener("click", () => this.armGotoB());
        if (btnStop) btnStop.addEventListener("click", () => this.armStop());
    }


    private armGotoA() {
        console.log('armGotoA command');
        this.actionQueue.push(ArmCommand.GOTO_A);
    }

    private armGotoB() {
        console.log('armGotoB command');
        this.actionQueue.push(ArmCommand.GOTO_B);
    }

    private armStop() {
        console.log('armStop command');
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

    private camera: THREE.PerspectiveCamera;
    private room: Room;
    private armCommandUI: ArmCommandUI;
    private actors: Actors;

    constructor(camera: THREE.PerspectiveCamera, room: Room, actors: Actors) {
        this.camera = camera;
        this.room = room;
        this.armCommandUI = new ArmCommandUI();
        this.actors = actors;
        initToolTip();
    }

    public updateSpatialUI(): void {
        for (const bubble of this.actors.table.bubbles) {
            bubble.update(this.camera);
        }
    }

    public getArmCommands(): Array<ArmCommand> {
        return this.armCommandUI.getAndClearQueue();
    }

}
