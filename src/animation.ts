import { SceneSetup } from './sceneSetup';
import {Models} from './models'

export function animate(sceneSetup: SceneSetup) {

  let modelMap = sceneSetup.modelMap;
  let renderer = sceneSetup.renderer;
  let scene = sceneSetup.scene;
  let camera = sceneSetup.camera;

  var draw = function(){
    let table = modelMap.get(Models.OpticalTable);
    if(table){
      table.rotation.x = 0.25*Math.PI;
    }
    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(draw);
}
