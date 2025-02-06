import * as THREE from 'three';
import { RoomObject } from '../object/roomObject';
import { Room } from './room';
import { PhysicsWorld } from '../system/physicsWorld';
import { createNoise2D } from 'simplex-noise';
import { PhysicsController } from '../object/physicsController';
import { Material, MeshStandardMaterial, Mesh } from 'three';
import { BoxGeometry } from 'three';

function createFloorMesh(): THREE.Mesh {
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

function createCubeMaterial(): Material {
    const material = new MeshStandardMaterial({ 
        color: 0x3498db, // Blue color
        metalness: 0.3, // Slight metallic effect
        roughness: 0.7  // Adjust roughness for a better look
    });
    return material;
}

export class RoomObjectFactory {

    world: PhysicsWorld;

    constructor(world: PhysicsWorld) {
        this.world = world;
    }

    createFloor(): RoomObject {
        let obj = createFloorMesh();
        let physicsController = new PhysicsController(obj, 0, this.world);
        return new RoomObject(obj, physicsController);
    }

    createCube(): RoomObject {
        const geometry = new BoxGeometry(1, 1, 1);
        const material = createCubeMaterial();
        const cube = new Mesh(geometry, material);
        cube.position.y = 0.5;
        cube.position.x = 1.0;
        cube.position.z = -4.5;
        let physicsController = new PhysicsController(cube, 1, this.world); 
        return new RoomObject(cube, physicsController);
    }

    createRoom(): Room {
        return {
            floor: this.createFloor(),
            cube: this.createCube()
        }
    }

}

