import * as THREE from 'three';

/*export function applyMaterialToVisuals(obj: THREE.Object3D, color: number) {
    const stack: THREE.Object3D[] = [obj];
    while (stack.length > 0) {
        const current = stack.pop()!;
        if (current.type === "URDFVisual") {
            const mesh = findFirstMesh(current);
            if (mesh) {
                mesh.material = createGenericMaterial(color);
            }
        }
        //console.log(current.name);
        stack.push(...current.children);
    }
}*/

export function applyMaterialToVisuals(
    obj: THREE.Object3D,
    materialFunction: (color: number) => THREE.Material,
    color: number
) {
    const stack: THREE.Object3D[] = [obj];
    while (stack.length > 0) {
        const current = stack.pop()!;
        if (current.type === "URDFVisual") {
            const mesh = findFirstMesh(current);
            if (mesh) {
                mesh.material = materialFunction(color);
            }
        }
        stack.push(...current.children);
    }
}

export function getLinkMesh(name: string, obj: THREE.Object3D): THREE.Mesh | null {
    const stack: THREE.Object3D[] = [obj];
    while (stack.length > 0) {
        const current = stack.pop()!;
        if (current.type === "URDFVisual") {
            const mesh = findFirstMesh(current);
            if (mesh && current.parent && current.parent.name === name) {
                return mesh;
            }
        }
        stack.push(...current.children);
    }
    return null;
}

function findFirstMesh(obj: THREE.Object3D): THREE.Mesh | null {
    let mesh: THREE.Mesh | null = null;
    obj.traverse(child => {
        if (!mesh && child instanceof THREE.Mesh) {
            mesh = child;
        }
    });
    return mesh;
}

export function createMaterial(color: number): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({ color });
}


