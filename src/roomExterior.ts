import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

export function getLights(): THREE.Light[] {
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 5, 5).normalize();
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  return [dirLight, ambientLight];
}

export function getFloor(): THREE.Mesh {
    return createFloor();
}

function createFloor(): THREE.Mesh {
  const floorGeometry = new THREE.PlaneGeometry(10, 10);
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const noise2D = createNoise2D();
    const scale = 0.01;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const nx = x / canvas.width - 0.5;
        const ny = y / canvas.height - 0.5;
        const value = noise2D(nx / scale, ny / scale);
        const color = Math.floor((value + 1) * 127.5);
        ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);

  const floorMaterial = new THREE.MeshStandardMaterial({ map: texture });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  return floor;
}