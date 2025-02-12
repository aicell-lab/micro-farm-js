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


export class UIController {

    private camera: THREE.PerspectiveCamera;
    private room: Room;
    //private actors: Actors;
    private armCommandUI: ArmCommandUI;

    constructor(camera: THREE.PerspectiveCamera, room: Room, _actors: Actors) {
        this.camera = camera;
        this.room = room;
        //this.actors = actors;
        this.armCommandUI = new ArmCommandUI();
        initToolTip();
    }

    public updateDiegeticUI(): void {
        this.room.cube.updateNameplate(this.camera);
    }

    public getArmCommands(): Array<ArmCommand> {
        return this.armCommandUI.getAndClearQueue();
    }

}
