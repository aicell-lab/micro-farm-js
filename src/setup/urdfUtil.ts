import * as THREE from 'three';

export function applyMaterialToVisuals(
    obj: THREE.Object3D,
    materialFunction: (color: number) => THREE.Material,
    color: number
) {
    for (const visual of getAllURDFVisuals(obj)) {
        const mesh = findFirstMesh(visual);
        if (mesh) {
            mesh.material = materialFunction(color);
        }
    }
}

export function getLinkMesh(name: string, obj: THREE.Object3D): THREE.Mesh | null {
    for (const visual of getAllURDFVisuals(obj)) {
        const mesh = findFirstMesh(visual);
        if (mesh && visual.parent?.name === name) {
            return mesh;
        }
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

export function getAllURDFVisuals(obj: THREE.Object3D): THREE.Object3D[] {
    const visuals: THREE.Object3D[] = [];
    const stack: THREE.Object3D[] = [obj];

    while (stack.length > 0) {
        const current = stack.pop()!;
        if (current.type === "URDFVisual") {
            visuals.push(current);
        }
        stack.push(...current.children);
    }

    return visuals;
}


export function getAllLinkMeshNames(obj: THREE.Object3D): string[] {
    return getAllURDFVisuals(obj)
        .map(visual => {
            const mesh = findFirstMesh(visual);
            const linkName = visual.parent?.name;
            return mesh && linkName ? linkName : null;
        })
        .filter((name): name is string => name !== null);
}

export function getLinkMeshesMap(obj: THREE.Object3D): Map<string, THREE.Mesh> {
    const meshes = new Map<string, THREE.Mesh>();

    for (const visual of getAllURDFVisuals(obj)) {
        const mesh = findFirstMesh(visual);
        const linkName = visual.parent?.name;
        if (mesh && linkName) {
            meshes.set(linkName, mesh);
        }
    }

    return meshes;
}
