import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import { Input } from '../io/input';
import { keybind, KeybindBitFlag } from '../io/keybind';

export function registerPlayerVisibilityToggle(entities: EntityCollection) {
    const player = entities.getActors().player;

    keybind.register("t", (_input: Input, _bitFlag: KeybindBitFlag) => {
        const newOpacity = cyclePlayerOpacity(player.object);
        applyOpacity(player.object, newOpacity);
    });
}

const OPACITY_CYCLE = [1.0, 0.5, 0.1];

function cyclePlayerOpacity(object: THREE.Object3D): number {
    const current = getCurrentOpacity(object);
    const epsilon = 0.01;
    const currentIndex = OPACITY_CYCLE.findIndex(v => Math.abs(current - v) < epsilon);
    const nextIndex = (currentIndex + 1) % OPACITY_CYCLE.length;
    return OPACITY_CYCLE[nextIndex];
}

function getCurrentOpacity(object: THREE.Object3D): number {
    let result = 1.0;

    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            const materials = getMeshMaterials(child);
            const mat = materials.find(isSupportedMaterial);
            if (mat) result = mat.opacity;
        }
    });

    return result;
}

function applyOpacity(object: THREE.Object3D, opacity: number) {
    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            const materials = getMeshMaterials(child);
            for (const mat of materials) {
                if (isSupportedMaterial(mat)) {
                    mat.transparent = opacity < 1.0;
                    mat.opacity = THREE.MathUtils.clamp(opacity, 0, 1);
                }
            }
        }
    });
}

function getMeshMaterials(mesh: THREE.Mesh): THREE.Material[] {
    const mat = mesh.material;
    return Array.isArray(mat) ? mat : [mat];
}

function isSupportedMaterial(mat: THREE.Material): mat is THREE.MeshStandardMaterial | THREE.MeshBasicMaterial {
    return mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshBasicMaterial;
}
