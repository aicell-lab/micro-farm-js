
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

const defaultBubbleOptions: BubbleOptions = {
    text: '<Insert Text>',
    font: '30px Arial',
    color: 'white',
    texture: Textures.Error,
    textureColor: 'black',
}

export class Bubble {

    private mesh: THREE.Mesh;

    constructor() {
        this.mesh = this.createMesh();
    }

    private setStandbyBubble(): void {

    }

    public setState(state: OpticsState) {
        switch (state) {
            case OpticsState.STANDBY:
                return this.setStandbyBubble();
            case OpticsState.CAPTURING:
                return this.setStandbyBubble();
            case OpticsState.ERROR:
                return this.setStandbyBubble();
            case OpticsState.LOADING:
                return this.setStandbyBubble();
        }
    }

    private getBubbleOptions(state: OpticsState): BubbleOptions {
        let options: BubbleOptions = defaultBubbleOptions;
        options.color = 'black';
        options.font = 'bold 50px Arial';
        options.textureColor = 'black';
        switch (state) {
            case OpticsState.STANDBY:
                options.texture = Textures.Timer;
                options.text = "Idle";
                break;
            case OpticsState.CAPTURING:
                options.texture = Textures.PhotoCamera;
                options.text = "Capturing";
                break;
            case OpticsState.ERROR:
                options.texture = Textures.Error;
                options.text = "Error";
                options.textureColor = 'red';
                break;
            case OpticsState.LOADING:
                options.texture = Textures.Timelapse;
                options.text = "Loading";
                break;
        }
        return options;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public setPosition(position: THREE.Vector3): void {
        this.mesh.position.copy(position);
    }

    private createMesh(): THREE.Mesh {
        let bubbleOptions = this.getBubbleOptions(OpticsState.STANDBY);
        return createBubbleStatus(bubbleOptions);
    }

    public update(camera: THREE.PerspectiveCamera) {
        const bubblePosition = this.mesh.position;
        const cameraPosition = camera.position.clone();
        cameraPosition.y = bubblePosition.y;
        this.mesh.lookAt(cameraPosition);
    }

}

function createBubbleStatus(options: Partial<BubbleOptions> = {}): THREE.Mesh {
    const finalOptions: BubbleOptions = { ...defaultBubbleOptions, ...options };
    const textGeometry = new THREE.PlaneGeometry(1, 1); // Use 1x1 for square
    const img = Assets.getInstance().getTextures().get(finalOptions.texture);
    const textMaterial = new THREE.MeshBasicMaterial({ map: createSpeechBubbleTexture(finalOptions.text, finalOptions.font, finalOptions.color, img!, finalOptions.textureColor), transparent: true });
    const mesh = new THREE.Mesh(textGeometry, textMaterial);

    const targetWidth = 0.4;
    const targetHeight = 0.4;
    mesh.scale.set(targetWidth, targetHeight, 1);

    return mesh;
}

function createSpeechBubbleTexture(text: string, font: string = '30px Arial', color: string = 'black', img: THREE.Texture, imgColor: string): THREE.CanvasTexture {
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

    if (img) {
        const imageCanvas = document.createElement('canvas');
        const imageCtx = imageCanvas.getContext('2d')!;
        imageCanvas.width = img.image.width;
        imageCanvas.height = img.image.height;
        imageCtx.drawImage(img.image, 0, 0);

        imageCtx.globalCompositeOperation = 'source-atop';
        imageCtx.fillStyle = imgColor;
        imageCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
        imageCtx.globalCompositeOperation = 'source-over';

        const imageWidth = 140;
        const imageHeight = 140;
        const imageX = (canvas.width - imageWidth) / 2;
        const imageY = padding / 2 + (bubbleHeight - imageHeight) / 2;

        ctx.drawImage(imageCanvas, imageX, imageY, imageWidth, imageHeight);


        const metrics = ctx.measureText(text); // Measure text width for centering
        const textHeight = metrics.actualBoundingBoxDescent + metrics.actualBoundingBoxAscent; // Get accurate text height

        const textX = canvas.width / 2;
        const textY = imageY + imageHeight + 15 + textHeight / 2;
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;


        ctx.fillText(text, textX, textY);
    } else {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 30);
    }

    return new THREE.CanvasTexture(canvas);
}

