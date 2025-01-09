import { Actor } from './actor';
import { InputListener } from '../io/input';
import { setResizeListener } from './window';
import { CameraController } from './cameraController';
import { SimulationLoop } from './simLoop';
import { SceneSetup } from '../setup/room';


export class SceneSystem {

  private inputListener: InputListener;
  private cameraController: CameraController;
  private simLoop: SimulationLoop;

  constructor(sceneSetup: SceneSetup, cameraController: CameraController, human: Actor) {
    setResizeListener(cameraController.getCameraSetup());
    this.inputListener = new InputListener();

    this.simLoop = new SimulationLoop(sceneSetup, human);
    this.cameraController = cameraController;
  }

  simulationLoop = () => {
    let action = this.inputListener.getAction();
  
    this.cameraController.setOffset();
    this.simLoop.step(action, this.cameraController.getCamera());
    this.cameraController.update();

    requestAnimationFrame(this.simulationLoop);
  };

}