import * as THREE from 'three';

export class SelectBox {
    private box: THREE.Mesh;
    private static readonly DEFAULT_SIZE = 0.25;

    constructor(bounds: THREE.Box3 = SelectBox.getDefaultBounds()) {
        const geometry = new THREE.BoxGeometry(
            bounds.max.x - bounds.min.x,
            bounds.max.y - bounds.min.y,
            bounds.max.z - bounds.min.z
        );

        const material = new THREE.MeshBasicMaterial({
            color: 0xaaee00,
            transparent: true,
            opacity: 0.2,
            depthWrite: false,
        });

        this.box = new THREE.Mesh(geometry, material);
        this.setPosition(new THREE.Vector3(0.95, 1.0, 0.41));
    }

    private static getDefaultBounds(): THREE.Box3 {
        const halfSize = SelectBox.DEFAULT_SIZE;
        return new THREE.Box3(
            new THREE.Vector3(-halfSize, -halfSize, -halfSize),
            new THREE.Vector3(halfSize, halfSize, halfSize)
        );
    }

    public setSize(width: number, height: number, depth: number): void {
        this.box.geometry.dispose();
        this.box.geometry = new THREE.BoxGeometry(width, height, depth);
    }

    public setPosition(position: THREE.Vector3): void {
        this.box.position.copy(position);
    }

    public getMesh(): THREE.Mesh {
        return this.box;
    }

    public setVisible(visible: boolean): void {
        this.box.visible = visible;
    }

}
