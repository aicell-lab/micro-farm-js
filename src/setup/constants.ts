import { Models, Animations, Textures } from "./enums";

export const TABLE_ROTATION_DEGREES = 0;
export const FLOOR_Y_POSITION = 0;
export const ZIPPED_ASSETS_PATH = './assets.zip'

//export const ROS_LAB_NAME = 'digital_twin_lab-4';
//export const ROS_LAB_PKG_PATH = './packages/digital_twin_lab-4';
//export const ROS_LAB_URDF_PATH = './packages/digital_twin_lab-4/urdf/robot_arm.urdf';

const labName = 'digital-twin-lab-v4-no-arm';
export const ROS_LAB_NAME = labName;
export const ROS_LAB_PKG_PATH = `./packages/${labName}`;
export const ROS_LAB_URDF_PATH = `./packages/${labName}/urdf/${labName}.urdf`;


export const modelFilepaths: { [key in Models]: string } = {
    [Models.OpticalTable]: "assets/objs/optical_table.obj",
};
export const animationFilepaths: { [key in Animations]: string } = {
    [Animations.Human]: "assets/gltfs/Character.glb",
};
export const textureFilepaths: { [key in Textures]: string } = {
    [Textures.Error]:       "assets/imgs/error.png",
    [Textures.PhotoCamera]: "assets/imgs/photo_camera.png",
    [Textures.Timelapse]:   "assets/imgs/timelapse.png",
    [Textures.Timer]:       "assets/imgs/timer.png",
};
