import * as THREE from 'three';
import { FileCollections } from './assets';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

function getCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  return camera
}

function getScene(): THREE.Scene {
  const scene = new THREE.Scene();

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);

  return scene
}

function getRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  return renderer;
}

function loadModels(collection: FileCollections): THREE.Object3D[] {
  let objects: THREE.Object3D[] = [];
  const objFile = collection.textFiles.get('objs/optical_table.obj');
  if (objFile) {
    const loader = new OBJLoader();
    var obj = loader.parse(objFile);

    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!mesh.material) {
          mesh.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
        }
      }
    });

    objects.push(obj);

  }
  return objects;
}

export function createScene(fileMaps: FileCollections): { scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, objects: THREE.Object3D[] } {
  let scene = getScene();
  let objects = loadModels(fileMaps);
  objects.forEach((obj) => { scene.add(obj); });
  return { scene, camera: getCamera(), renderer: getRenderer(), objects };
}
