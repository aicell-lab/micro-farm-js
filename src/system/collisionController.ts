import * as THREE from "three";

function changeObjectColor(object: THREE.Object3D, color: THREE.Color | string | number) {
    object.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                    mat.color.set(color);
                    mat.needsUpdate = true;
                });
            } else {
                child.material.color.set(color);
                child.material.needsUpdate = true;
            }
        }
    });
}

export class CollisionController {
    private objects: THREE.Object3D[] = [];
    private originalMaterials: Map<THREE.Object3D, THREE.Material | THREE.Material[]> = new Map();
    private collidingObjects: Set<THREE.Object3D> = new Set();

    constructor() {

    }

    addObject(object: THREE.Object3D) {
        this.objects.push(object);
    }

    removeObject(object: THREE.Object3D) {
        this.objects = this.objects.filter(obj => obj !== object);
        this.originalMaterials.delete(object);
        this.collidingObjects.delete(object);
    }

    checkCollisions() {
        const newColliding = new Set<THREE.Object3D>();

        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i + 1; j < this.objects.length; j++) {
                if (this.isColliding(this.objects[i], this.objects[j])) {
                    newColliding.add(this.objects[i]);
                    newColliding.add(this.objects[j]);

                    this.storeOriginalMaterial(this.objects[i]);
                    this.storeOriginalMaterial(this.objects[j]);

                    const collisionColor = new THREE.Color(0.5, 0.5, 0.5);
                    changeObjectColor(this.objects[i], collisionColor);
                    changeObjectColor(this.objects[j], collisionColor);
                }
            }
        }

        this.collidingObjects.forEach((object) => {
            if (!newColliding.has(object)) {
                this.restoreOriginalMaterial(object);
            }
        });

        this.collidingObjects = newColliding;
    }

    private isColliding(obj1: THREE.Object3D, obj2: THREE.Object3D): boolean {
        const box1 = new THREE.Box3().setFromObject(obj1);
        const box2 = new THREE.Box3().setFromObject(obj2);
        return box1.intersectsBox(box2);
    }

    private storeOriginalMaterial(object: THREE.Object3D) {
        object.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                if (!this.originalMaterials.has(child)) {
                    if (Array.isArray(child.material)) {
                        this.originalMaterials.set(child, child.material.map(mat => mat.clone()));
                    } else {
                        this.originalMaterials.set(child, child.material.clone());
                    }
                }
            }
        });
    }

    private restoreOriginalMaterial(object: THREE.Object3D) {
        object.traverse((child) => {
            if (child instanceof THREE.Mesh && this.originalMaterials.has(child)) {
                const originalMaterial = this.originalMaterials.get(child)!;

                if (Array.isArray(originalMaterial)) {
                    child.material = originalMaterial.map(mat => mat.clone());
                } else {
                    child.material = originalMaterial.clone();
                }

                child.material.needsUpdate = true;
            }
        });

        this.originalMaterials.delete(object);
    }


}