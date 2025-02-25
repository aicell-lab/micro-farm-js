import { Models, Animations, Textures } from "./enums";

export const FLOOR_Y_POSITION = 0;
export const ZIPPED_ASSETS_PATH = './assets.zip'

export const modelFilepaths: { [key in Models]: string } = {
    // [Models.OpticalTable]: "assets/objs/optical_table.obj",
};
export const animationFilepaths: { [key in Animations]: string } = {
    [Animations.Human]: "assets/gltfs/Character.glb",
};
export const textureFilepaths: { [key in Textures]: string } = {
    [Textures.Error]: "assets/imgs/error.png",
    [Textures.PhotoCamera]: "assets/imgs/photo_camera.png",
    [Textures.Timelapse]: "assets/imgs/timelapse.png",
    [Textures.Timer]: "assets/imgs/timer.png",
};
