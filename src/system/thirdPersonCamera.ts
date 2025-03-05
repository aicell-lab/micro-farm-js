import * as THREE from 'three';

export class ThirdPersonCamera {
    private targetObject: THREE.Object3D;
    private currentPosition: THREE.Vector3;
    private currentLookat: THREE.Vector3;
    private camera: THREE.PerspectiveCamera;
    private zoomLevel: number;
    private readonly ZOOM_SPEED = 0.1;

    constructor(camera: THREE.PerspectiveCamera, targetObject: THREE.Object3D, initialZoom: number = 1.0) {
        this.targetObject = targetObject;
        this.camera = camera;
        this.currentPosition = new THREE.Vector3();
        this.currentLookat = new THREE.Vector3();
        this.zoomLevel = initialZoom;
    }

    private getIdealOffset(): THREE.Vector3 {
        const baseOffset = new THREE.Vector3(-1.6, 1.7, -2.5);

        // Instead of scaling everything, only scale X and Z for better zoom behavior
        const zoomedOffset = new THREE.Vector3(
            baseOffset.x * this.zoomLevel, // Scale X
            baseOffset.y, // Keep Y constant
            baseOffset.z * this.zoomLevel // Scale Z (depth)
        );

        zoomedOffset.applyQuaternion(this.targetObject.quaternion);
        zoomedOffset.add(this.targetObject.position);
        return zoomedOffset;
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

    public adjustZoom(scrollDelta: number): void {
        scrollDelta *= -1.0;
        this.zoomLevel = THREE.MathUtils.clamp(this.zoomLevel - scrollDelta * this.ZOOM_SPEED, 0.5, 2.0);
    }

}
