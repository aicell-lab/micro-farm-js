
import * as THREE from 'three';
import { Assets } from '../res/assets';
import { Textures } from '../setup/enums';

export interface NameplateOptions {
    text: string,
    font: string,
    color: string,
}

const defaultNameplateOptions: NameplateOptions = {
    text: '<Insert Text>',
    font: '30px Arial',
    color: 'white',
}

function createTextTexture(text: string, font: string = '30px Arial', color: string = 'white'): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = font;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;

    const canvasWidth = Math.ceil(textWidth) + 20;
    const canvasHeight = 50;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

export function createNameplate(options: Partial<NameplateOptions> = {}): THREE.Mesh {
    const finalOptions: NameplateOptions = { ...defaultNameplateOptions, ...options };
    const textGeometry = new THREE.PlaneGeometry(2.5, 0.5);
    const textMaterial = new THREE.MeshBasicMaterial({ map: createTextTexture(finalOptions.text, finalOptions.font, finalOptions.color), transparent: true });
    return new THREE.Mesh(textGeometry, textMaterial);
}

export function createBubbleStatus(options: Partial<NameplateOptions> = {}): THREE.Mesh {
    const finalOptions: NameplateOptions = { ...defaultNameplateOptions, ...options };
    const textGeometry = new THREE.PlaneGeometry(1, 1); // Use 1x1 for square
    const testImg = Assets.getInstance().getTextures().get(Textures.Error);
    const textMaterial = new THREE.MeshBasicMaterial({ map: createSpeechBubbleTexture(finalOptions.text, finalOptions.font, finalOptions.color, testImg), transparent: true });
    const mesh = new THREE.Mesh(textGeometry, textMaterial);

    const canvas = createSpeechBubbleTexture(finalOptions.text, finalOptions.font, finalOptions.color, testImg).image; // Get the canvas
    const maxDimension = Math.max(canvas.width, canvas.height); // Find the larger dimension
    mesh.scale.set(maxDimension / 500, maxDimension / 500, 1); // Scale it. Adjust 500 as needed

    return mesh;
}


export function createSpeechBubbleTexture(text: string, font: string = '30px Arial', color: string = 'black', imageTexture?: THREE.Texture): THREE.CanvasTexture {
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

    if (imageTexture) {
        const imageCanvas = document.createElement('canvas');
        const imageCtx = imageCanvas.getContext('2d')!;
        imageCanvas.width = imageTexture.image.width;
        imageCanvas.height = imageTexture.image.height;
        imageCtx.drawImage(imageTexture.image, 0, 0);

        imageCtx.globalCompositeOperation = 'source-atop';
        imageCtx.fillStyle = 'red';
        imageCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
        imageCtx.globalCompositeOperation = 'source-over';

        const imageWidth = 80;
        const imageHeight = 80;  
        const imageX = (canvas.width - imageWidth) / 2;
        const imageY = padding + 10; 

        ctx.drawImage(imageCanvas, imageX, imageY, imageWidth, imageHeight);
    }

    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 30);

    return new THREE.CanvasTexture(canvas);
}

