
import * as THREE from 'three';
import { Assets } from '../res/assets';
import { Textures, OpticsState } from '../setup/enums';

interface BubbleOptions {
    text: string,
    font: string,
    color: string,
    texture: Textures,
    textureColor: string,
}

const bubbleOptionsByState: Record<OpticsState, BubbleOptions> = {
    [OpticsState.STANDBY]: {
        text: 'Idle',
        font: 'bold 50px Arial',
        color: 'black',
        texture: Textures.Timer,
        textureColor: 'black',
    },
    [OpticsState.CAPTURING]: {
        text: 'Capturing',
        font: 'bold 50px Arial',
        color: 'black',
        texture: Textures.PhotoCamera,
        textureColor: 'black',
    },
    [OpticsState.ERROR]: {
        text: 'Error',
        font: 'bold 50px Arial',
        color: 'black',
        texture: Textures.Error,
        textureColor: 'red',
    },
    [OpticsState.LOADING]: {
        text: 'Loading',
        font: 'bold 50px Arial',
        color: 'black',
        texture: Textures.Timelapse,
        textureColor: 'black',
    },
};

export class Bubble {

    private mesh: THREE.Mesh;

    constructor() {
        this.mesh = this.createMesh();
    }

    public setState(state: OpticsState) {
        const newTexture = createSpeechBubbleTexture(bubbleOptionsByState[state]);
        const material = this.mesh.material as THREE.MeshBasicMaterial;
        material.map = newTexture;
        material.needsUpdate = true;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public setPosition(position: THREE.Vector3): void {
        this.mesh.position.copy(position);
    }

    private createMesh(): THREE.Mesh {
        return createBubbleStatus(bubbleOptionsByState[OpticsState.STANDBY]);
    }

    public update(camera: THREE.PerspectiveCamera) {
        const bubblePosition = this.mesh.position;
        const cameraPosition = camera.position.clone();
        cameraPosition.y = bubblePosition.y;
        this.mesh.lookAt(cameraPosition);
    }

}

function createBubbleStatus(options: BubbleOptions): THREE.Mesh {
    const textGeometry = new THREE.PlaneGeometry(1, 1); // Use 1x1 for square
    const textMaterial = new THREE.MeshBasicMaterial({ map: createSpeechBubbleTexture(options), transparent: true });
    const mesh = new THREE.Mesh(textGeometry, textMaterial);
    const targetWidth = 0.4;
    const targetHeight = 0.4;
    mesh.scale.set(targetWidth, targetHeight, 1);
    return mesh;
}

function createSpeechBubbleTexture(options: BubbleOptions): THREE.CanvasTexture {
    const { text, font, color, texture, textureColor } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const padding = 15;
    const bubbleWidth = 400;
    const bubbleHeight = 200;
    const tailSize = 40;

    canvas.width = bubbleWidth + padding * 2;
    canvas.height = bubbleHeight + padding * 2 + tailSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 10,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, 'gray');
    ctx.fillStyle = gradient;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(padding + 20, padding);
    ctx.lineTo(bubbleWidth - 20 + padding, padding);
    ctx.quadraticCurveTo(bubbleWidth + padding, padding, bubbleWidth + padding, padding + 20);
    ctx.lineTo(bubbleWidth + padding, bubbleHeight - 20 + padding);
    ctx.quadraticCurveTo(bubbleWidth + padding, bubbleHeight + padding, bubbleWidth - 20 + padding, bubbleHeight + padding);
    ctx.lineTo(padding + 40, bubbleHeight + padding);
    ctx.lineTo(padding + 20, bubbleHeight + padding + tailSize);
    ctx.lineTo(padding, bubbleHeight + padding);
    ctx.quadraticCurveTo(padding, bubbleHeight + padding, padding, bubbleHeight - 20 + padding);
    ctx.lineTo(padding, padding + 20);
    ctx.quadraticCurveTo(padding, padding, padding + 20, padding);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    //img
    const imageCanvas = document.createElement('canvas');
    const imageCtx = imageCanvas.getContext('2d')!;
    const img = Assets.getInstance().getTextures().get(texture)!;
    imageCanvas.width = img.image.width;
    imageCanvas.height = img.image.height;
    imageCtx.drawImage(img.image, 0, 0);

    imageCtx.globalCompositeOperation = 'source-atop';
    imageCtx.fillStyle = textureColor;
    imageCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
    imageCtx.globalCompositeOperation = 'source-over';

    const imageWidth = 140;
    const imageHeight = 140;
    const imageX = (canvas.width - imageWidth) / 2;
    const imageY = padding / 2 + (bubbleHeight - imageHeight) / 2;

    ctx.drawImage(imageCanvas, imageX, imageY, imageWidth, imageHeight);

    //text
    ctx.font = font;
    const metrics = ctx.measureText(text); // Measure text width for centering
    const textHeight = metrics.actualBoundingBoxDescent + metrics.actualBoundingBoxAscent; // Get accurate text height
    const textX = canvas.width / 2;
    const textY = imageY + imageHeight + textHeight / 2;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(text, textX, textY);

    return new THREE.CanvasTexture(canvas);
}

