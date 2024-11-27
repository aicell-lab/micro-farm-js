import { createScene } from './sceneSetup';
import { animate } from './animation';
import { getFileCollections } from './assets';

async function initializeApp() {
    try {
        const fileMaps = await getFileCollections();
        console.log('ZIP file loaded and extracted successfully.', fileMaps);
        const { scene, camera, renderer, objects } = createScene(fileMaps);
        animate(objects, scene, camera, renderer);
    } catch (error) {
        console.error('Error during ZIP loading:', error);
    }
}

initializeApp();
