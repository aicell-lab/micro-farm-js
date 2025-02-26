import { LoadingManager } from 'three';
import URDFLoader, { URDFRobot } from 'urdf-loader';
import { Robots } from '../setup/enums';

export interface URDFPackage {
    packageName: string;
    packagePath: string;
    urdfPath: string;
}

function getURDFPackageInfo(pkgName: string): URDFPackage {
    return {
        packageName: pkgName,
        packagePath: `./packages/${pkgName}`,
        urdfPath: `./packages/${pkgName}/urdf/${pkgName}.urdf`
    };
}

const urdfPackageNames: Map<Robots, string> = new Map([
    [Robots.OpticalTable, 'digital-twin-lab-v4-no-arm'],
    [Robots.Arm, 'dorna2-rebuild']
]);

const urdfPackages: Map<Robots, URDFPackage> = new Map(
    Array.from(urdfPackageNames.entries()).map(([robotType, pkgName]) => [
        robotType,
        getURDFPackageInfo(pkgName)
    ])
);

async function _loadURDF(loader: URDFLoader, pgg: URDFPackage): Promise<URDFRobot> {
    loader.packages = {
        [pgg.packageName]: pgg.packagePath
    };
    const robot = await loader.loadAsync(pgg.urdfPath);
    return robot;
}

export async function loadURDF(type: Robots): Promise<URDFRobot> {
    const manager = new LoadingManager();
    const loader = new URDFLoader(manager);

    const pkg = urdfPackages.get(type);
    if (!pkg) {
        throw new Error(`URDF package not found for robot type: ${type}`);
    }
    const robot = await _loadURDF(loader, pkg);
    return robot;
}
