import { ZIPPED_ASSETS_PATH } from '../setup/constants'
import { loadAndExtractZipBinaryFiles, loadAndExtractZipTextFiles } from './assetLoader';
import { FileCollections } from '../types/assetTypes';

/**
 * Merges multiple Map objects into one.
 * @param maps - An array of Map objects to be merged.
 * @returns A new Map containing all entries from the input maps.
 */
function mergeMaps<K, V>(...maps: Map<K, V>[]): Map<K, V> {
    const mergedMap = new Map<K, V>();

    maps.forEach((map) => {
        map.forEach((value, key) => {
            mergedMap.set(key, value);
        });
    });

    return mergedMap;
}

async function retrieveMergedMap(
    zipFilePath: string,
    extensions: string[],
    loaderFunction: (zipFilePath: string, extension: string) => Promise<Map<string, any>>
): Promise<Map<string, any>> {
    const maps = await Promise.all(extensions.map((ext) => loaderFunction(zipFilePath, ext)));
    return mergeMaps(...maps);
}

async function getTextFiles(): Promise<Map<string, string>> {
    const fileExtensions = [".obj", ".urdf"];
    return await retrieveMergedMap(ZIPPED_ASSETS_PATH, fileExtensions, loadAndExtractZipTextFiles);
}

async function getBinaryFiles(): Promise<Map<string, ArrayBuffer>> {
    const fileExtensions = [".png", ".STL", ".glb"];
    return await retrieveMergedMap(ZIPPED_ASSETS_PATH, fileExtensions, loadAndExtractZipBinaryFiles);
}

async function getFileCollections(): Promise<FileCollections> {
    return {
        textFiles: await getTextFiles(),
        binaryFiles: await getBinaryFiles(),
    };
}

export async function getFileCollectionsNoThrow(): Promise<FileCollections> {
    let fileMaps: FileCollections | null = null;
    try {
        fileMaps = await getFileCollections();
        console.log('ZIP file loaded and extracted successfully.', fileMaps);
    } catch (error) {
        console.error('Error during ZIP loading:', error);
    }
    return fileMaps || { textFiles: new Map(), binaryFiles: new Map() };
}
