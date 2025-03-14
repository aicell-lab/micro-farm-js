
export interface JointsSync {
    j0: number;
    j1: number;
    j2: number;
    j3: number;
    j4: number;
}

export const altSync1: JointsSync = {
    j0: 0,
    j1: 0,
    j2: 0,
    j3: 0,
    j4: 0,
};

export const altSync2: JointsSync = {
    j0: 0,
    j1: 106.45752,
    j2: -116.608887,
    j3: -79.49707,
    j4: 0.65918,
};

export const altSync3: JointsSync = {
    j0: 45,
    j1: 60,
    j2: -90,
    j3: -100,
    j4: 0,
};

export const altSync4: JointsSync = {
    j0: 0,
    j1: 75.5,
    j2: -85.5,
    j3: -95.75,
    j4: -2.5,
};

export const altSync5: JointsSync = {
    j0: 90,
    j1: 45,
    j2: -60,
    j3: -110,
    j4: 15,
};

const presets: JointsSync[] = [altSync1, altSync2, altSync3, altSync4, altSync5];
let currentIndex = 0;

export function getJointsSync(): JointsSync {
    const result = presets[currentIndex];
    currentIndex = (currentIndex + 1) % presets.length;
    return result;
}

function convertToJointsSync(data: number[]): JointsSync {
    return {
        j0: data[0],
        j1: data[1],
        j2: data[2],
        j3: data[3],
        j4: data[4],
    };
}

export async function fetchJointsSyncFromAPI(): Promise<JointsSync> {
    const response = await fetch("https://hypha.aicell.io/reef-imaging/services/robotic-arm-control/get_all_joints");
    console.log("received response: ", response);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: number[] = await response.json();
    const convertedData = convertToJointsSync(data);
    return convertedData
}


