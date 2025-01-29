import { RoomObject } from "./roomObject";
import { BoxGeometry, MeshStandardMaterial, Mesh, Material } from "three";

function createMaterial(): Material {
    const material = new MeshStandardMaterial({ 
        color: 0x3498db, // Blue color
        metalness: 0.3, // Slight metallic effect
        roughness: 0.7  // Adjust roughness for a better look
    });
    return material;
}

export class TCube extends RoomObject {

    constructor() {
        const geometry = new BoxGeometry(1, 1, 1);
        const material = createMaterial();
        const cube = new Mesh(geometry, material);
        cube.position.y = 0.5;
        cube.position.x = 1.0;
        cube.position.z = -4.5;
        super(cube);
    }
}
