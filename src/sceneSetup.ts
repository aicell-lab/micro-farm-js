import * as THREE from 'three';
import { FileCollections } from './assets';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export function createScene(fileMaps: FileCollections): { scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, objects: THREE.Object3D[]} {
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);

  const objects: THREE.Object3D[] = [];
  const objFile = fileMaps.textFiles.get('objs/optical_table.obj');
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

    scene.add(obj);
    objects.push(obj);
  } else {
    console.error('OBJ file not found in the binary files collection.');
  }

  return { scene, camera, renderer, objects };
}
