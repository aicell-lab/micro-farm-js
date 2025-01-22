import { GUI } from 'dat.gui'
import { RoomActors } from '../actor/roomActors';
import { Action } from '../types/action';
import { Actions, ActionPayload } from '../types/actionType';

/* Must be instantiated after the CameraController class. */
export class DashboardController {

    private gui: GUI;
    private actionQueue: Array<Action> = [];
    private baseController!: dat.GUIController;

    constructor(actors: RoomActors) {
        this.gui = new GUI()
        const tableFolder = this.gui.addFolder('Table')
        let table = actors.table;
        const self = this;

        this.baseController = tableFolder.add({
            get base(): number {
                return table.targetAngle;
            },
            set base(value: number) {
                self.addBaseMoveActionToQueue(value);
            },
        }, 'base', -3.5, 0.0, 0.02);

        tableFolder.open();
    }

    private createBaseMoveAction(value: number): Action {
        const target: ActionPayload = { type: Actions.ARM_BASE_MOVE, payload: { angle: value } };
        return new Action(target);
    }

    private addBaseMoveActionToQueue(value: number) {
        this.actionQueue = [];
        this.actionQueue.push(this.createBaseMoveAction(value));
    }

    public getAndClearQueue(): Array<Action> {
        const queue = [...this.actionQueue];
        this.actionQueue = [];
        return queue;
    }

    public updateDisplay() {
        this.baseController.updateDisplay();
    }

}