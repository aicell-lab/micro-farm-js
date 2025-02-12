
import * as THREE from 'three';

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

