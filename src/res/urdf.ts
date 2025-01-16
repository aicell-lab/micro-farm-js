import { LoadingManager } from 'three';
import URDFLoader, { URDFRobot } from 'urdf-loader';
import { RobotType, ROS_LAB_NAME, ROS_LAB_PKG_PATH, ROS_LAB_URDF_PATH } from '../setup/constants';

export interface URDFPackage {
    packageName: string;
    packagePath: string;
    urdfPath: string;
}

function _loadURDF(loader: URDFLoader, pgg: URDFPackage): Promise<URDFRobot> {
    return new Promise((resolve, reject) => {

        loader.packages = {
            [pgg.packageName]: pgg.packagePath
        }

        loader.load(
            pgg.urdfPath,
            robot => resolve(robot),
            undefined,
            error => reject(error)
        );
    });
}

function getPackage(type: RobotType): URDFPackage {
    let packageName = '';
    let packagePath = '';
    let urdfPath = '';
    if (type == RobotType.OpticalTable) {
        packageName = ROS_LAB_NAME;
        packagePath = ROS_LAB_PKG_PATH;
        urdfPath = ROS_LAB_URDF_PATH;
    }

    return { packageName: packageName, packagePath: packagePath, urdfPath: urdfPath };
}

export function loadURDF(type: RobotType): Promise<URDFRobot> {
    const manager = new LoadingManager();
    const loader = new URDFLoader(manager);
    const pkg = getPackage(type);
    return _loadURDF(loader, pkg);
}