import { Entity } from '../entity/entity';
import * as THREE from 'three';
import { EntityCollection } from '../setup/entityCollection';
import { Input } from '../io/input';

export function togglePlayerVisibility(entities: EntityCollection, input: Input) {
    const player = entities.getActors().player;
    const toggleKey = "t";
    if (input.keys.pressed.has(toggleKey)) {
        setOpacity(player.object, getNextOpacity(player));
    }
}

function getNextOpacity(player: Entity): number {
    let opacity = getOpacity(player.object);
    if (opacity <= 0.1) {
        opacity = 1.0;
    } else if (opacity <= 0.5) {
        opacity = 0.1;
    } else {
        opacity = 0.5;
    }
    return opacity;
}

function setOpacity(object: THREE.Object3D, opacity: number) {
    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            const material = child.material as THREE.Material;

            if (Array.isArray(material)) {
                material.forEach((mat) => {
                    if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshBasicMaterial) {
                        mat.transparent = true;
                        mat.opacity = THREE.MathUtils.clamp(opacity, 0, 1);
                    }
                });
            } else {
                if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
                    material.transparent = true;
                    material.opacity = THREE.MathUtils.clamp(opacity, 0, 1);
                }
            }
        }
    });
}

function getOpacity(object: THREE.Object3D): number {
    let opacity: number = 0;
    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            const material = child.material as THREE.Material;
            if (Array.isArray(material)) {
                for (const mat of material) {
                    if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshBasicMaterial) {
                        opacity = mat.opacity;
                        break;
                    }
                }
            } else {
                if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
                    opacity = material.opacity;
                }
            }
        }
    });
    return opacity;
}