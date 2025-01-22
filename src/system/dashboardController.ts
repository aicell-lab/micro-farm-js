import { GUI } from 'dat.gui'
import { RoomActors } from '../actor/roomActors';

/* Must be instantiated after the CameraController class. */
export class DashboardController {

    private gui: GUI;

    constructor(actors: RoomActors) {
        this.gui = new GUI()
        const tableFolder = this.gui.addFolder('Table')
        let table = actors.table;
        tableFolder.add({
            get base() {
                return table.targetAngle;
            },
            set base(value) {
                table.targetAngle = value;
            },
        }, 'base', -3.5, 0.0, 0.02);
        tableFolder.open();
    }

}