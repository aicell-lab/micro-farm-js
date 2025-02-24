import * as THREE from 'three';
import { EntityCollection } from './entityCollection';
import { Sky } from 'three/examples/jsm/Addons.js';

export class SceneFactory {
    private entities: EntityCollection;

    constructor(entities: EntityCollection) {
        this.entities = entities;
    }

    createSky(): Sky {
        const sky = new Sky();
        sky.scale.setScalar(10000);
        const sun = new THREE.Vector3();
        const phi = THREE.MathUtils.degToRad(90);
        const theta = THREE.MathUtils.degToRad(0);
        sun.setFromSphericalCoords(1, phi, theta);
        sky.material.uniforms['rayleigh'].value = 0.95;
        sky.material.uniforms['mieCoefficient'].value = 0.0;
        sky.material.uniforms['mieDirectionalG'].value = 0.0;
        sky.material.uniforms.sunPosition.value.copy(sun);
        return sky;
    }

    createScene(): THREE.Scene {
        const scene = new THREE.Scene();
        createLights().forEach((light) => scene.add(light));
        this.populateScene(scene);
        scene.add(this.createSky());
        return scene
    }

    private populateScene(scene: THREE.Scene): void {
        for (const e of this.entities.getEntities()) {
            scene.add(e.object);
        }
        for (const b of this.entities.getBubbles()) {
            scene.add(b.getMesh());
        }
        for (const s of this.entities.getSelectBoxes()) {
            scene.add(s.getMesh());
        }
    }
}

function createLights(): THREE.Light[] {
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5).normalize();
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 0.2);
    return [dirLight, ambientLight, hemiLight];
}



