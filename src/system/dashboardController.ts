import { GUI } from 'dat.gui'
import { RoomActors } from '../actor/roomActors';

/* Must be instantiated after the CameraController class. */
export class DashboardController {

    private gui: GUI;

    constructor(actors: RoomActors) {
        this.gui = new GUI()
        const tableFolder = this.gui.addFolder('Table')
        let p = actors.table.object.position;
        tableFolder.add(p, 'x', 0, 5.0, 0.02);
        tableFolder.add(p, 'y', 0, Math.PI * 2);
        tableFolder.add(p, 'z', 0, Math.PI * 2);
        tableFolder.open();
    }

}