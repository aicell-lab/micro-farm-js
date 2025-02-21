import * as THREE from 'three';

export class ThirdPersonCamera {
    private targetObject: THREE.Object3D;
    private currentPosition: THREE.Vector3;
    private currentLookat: THREE.Vector3;
    private camera: THREE.PerspectiveCamera;

    private getIdealOffset(): THREE.Vector3 {
        const idealOffset = new THREE.Vector3(-1.6, 0.7, -2.5);
        idealOffset.applyQuaternion(this.targetObject.quaternion);
        idealOffset.add(this.targetObject.position);
        return idealOffset;
    }

    private getIdealLookat(): THREE.Vector3 {
        const idealLookat = new THREE.Vector3(0, 1, 30);
        idealLookat.applyQuaternion(this.targetObject.quaternion);
        idealLookat.add(this.targetObject.position);
        return idealLookat;
    }

    public update(_dt: number): void {
        const idealOffset = this.getIdealOffset();
        const idealLookat = this.getIdealLookat();
        this.currentPosition = idealOffset;
        this.currentLookat = idealLookat;
        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentLookat);
    }

    constructor(camera: THREE.PerspectiveCamera, targetObject: THREE.Object3D) {
        this.targetObject = targetObject;
        this.camera = camera;
        this.currentPosition = new THREE.Vector3();
        this.currentLookat = new THREE.Vector3();
    }

}
