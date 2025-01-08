import { SceneSetup } from '../types/setup'

export function setResizeListener(sceneSetup: SceneSetup) {
  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    sceneSetup.renderer.setSize(width, height);
    sceneSetup.cameraSetup.camera.aspect = width / height;
    sceneSetup.cameraSetup.camera.updateProjectionMatrix();
    sceneSetup.cameraSetup.cameraCtrl.update();
  });
}
