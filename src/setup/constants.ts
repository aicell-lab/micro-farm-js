export const TABLE_ROTATION_DEGREES = 0;
export const FLOOR_Y_POSITION = 0;
export const ZIPPED_ASSETS_PATH = './assets.zip'

export const ROS_LAB_NAME = 'digital_twin_lab-4';
export const ROS_LAB_PKG_PATH = './packages/digital_twin_lab-4';
export const ROS_LAB_URDF_PATH = './packages/digital_twin_lab-4/urdf/robot_arm.urdf';

import { Models, Animations } from "./enums";
export const modelFilepaths: { [key in Models]: string } = {
    [Models.OpticalTable]: "assets/objs/optical_table.obj",
};

export const animationFilepaths: { [key in Animations]: string } = {
    [Animations.Human]: "assets/gltfs/CesiumMan.glb",
};

