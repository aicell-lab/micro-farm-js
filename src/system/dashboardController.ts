import { GUI } from 'dat.gui'
import { ArmCommand } from '../actor/armState';

/* Must be instantiated after the CameraController class. */
export class DashboardController {

    private gui: GUI;
    private actionQueue: Array<ArmCommand> = [];

    constructor() {
        this.gui = new GUI();
        const tableFolder = this.gui.addFolder('Table');
        tableFolder.add({ armGotoA: () => this.armGotoA() }, 'armGotoA').name('Position A');
        tableFolder.add({ armGotoB: () => this.armGotoB() }, 'armGotoB').name('Position B');
        tableFolder.add({ armStop: () => this.armStop() }, 'armStop').name('STOP');
        tableFolder.open();
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

    public updateDisplay() {
        //this.baseController.updateDisplay();
    }

}

