import * as THREE from 'three';
import { UIState } from '../setup/enums';

export class SelectBox {
    private box: THREE.Mesh;
    private static readonly DEFAULT_SIZE = 0.25;
    private state: UIState = UIState.DEFAULT;

    public static readonly COLOR_DEFAULT = 0xaaee00;
    public static readonly COLOR_HOVER = 0xffaa00;
    public static readonly COLOR_SELECTED = 0x00aaff;
    public static readonly COLOR_DISABLED = 0x555555;

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

    private setColor(color: number): void {
        (this.box.material as THREE.MeshBasicMaterial).color.set(color);
    }

    public setState(state: UIState): void {
        this.state = state;
    }

    public getState(): UIState {
        return this.state;
    }

    private getStateColor(state: UIState): number {
        switch (state) {
            case UIState.DEFAULT:
                return SelectBox.COLOR_DEFAULT;
            case UIState.SELECTED:
                return SelectBox.COLOR_SELECTED;
            case UIState.HOVER:
                return SelectBox.COLOR_HOVER;
            case UIState.DISABLED:
                return SelectBox.COLOR_DISABLED;
            default:
                return 0;
        }
    }

    public update(): void {
        this.setColor(this.getStateColor(this.state));
    }

    public isVisible(): boolean {
        return this.getMesh().visible;
    }


}
