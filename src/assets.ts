import JSZip from 'jszip';
import { assetPath } from './paths';

export interface FileCollections {
    textFiles: Map<string, string>;
    binaryFiles: Map<string, ArrayBuffer>;
}

export interface BlobCollections {
    textFileURIs: Map<string, string>;
    binaryFileURIs: Map<string, string>;
}

export function createBlobURIs(fileCollections: FileCollections): BlobCollections {
    const textFileURIs = new Map<string, string>();
    const binaryFileURIs = new Map<string, string>();

    for (const [fileName, content] of fileCollections.textFiles.entries()) {
        const blob = new Blob([content], { type: "text/plain" });
        const uri = URL.createObjectURL(blob);
        textFileURIs.set(fileName, uri);
    }
    for (const [fileName, content] of fileCollections.binaryFiles.entries()) {
        const blob = new Blob([content], { type: "application/octet-stream" });
        const uri = URL.createObjectURL(blob);
        binaryFileURIs.set(fileName, uri);
    }

    return { textFileURIs, binaryFileURIs };
}

/**
 * Loads a ZIP file and extracts files based on their extension and content type.
 * @param zipFilePath - The path to the ZIP file.
 * @param fileExtension - The file extension to filter (e.g., ".obj" or ".png").
 * @param contentType - The type of content to extract ('text' or 'arraybuffer').
 * @returns A promise resolving to a map of filenames to their content.
 */
async function loadAndExtractZipFiles(
    zipFilePath: string,
    fileExtension: string,
    contentType: 'text' | 'arraybuffer'
): Promise<Map<string, string | ArrayBuffer>> {
    const fileMap = new Map<string, string | ArrayBuffer>();

    try {
        const response = await fetch(zipFilePath);
        if (!response.ok) {
            throw new Error(`Failed to load ZIP file: ${response.statusText}`);
        }
        const zipData = await response.arrayBuffer();
        const zip = await JSZip.loadAsync(zipData);

        for (const fileName of Object.keys(zip.files)) {
            const file = zip.files[fileName];
            if (file && !file.dir && fileName.endsWith(fileExtension)) {
                const content = await file.async(contentType);
                fileMap.set(fileName, content);
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error loading ZIP file: ${error.message}`);
        } else {
            console.error(`Unknown error occurred: ${JSON.stringify(error)}`);
        }
    }

    return fileMap;
}

/**
 * Extracts text files from a ZIP file.
 * @param zipFilePath - The path to the ZIP file.
 * @param fileExtension - The file extension to filter (e.g., ".txt").
 * @returns A promise resolving to a map of filenames to their text content.
 */
export async function loadAndExtractZipTextFiles(zipFilePath: string, fileExtension: string): Promise<Map<string, string>> {
    return loadAndExtractZipFiles(zipFilePath, fileExtension, 'text') as Promise<Map<string, string>>;
}

/**
 * Extracts binary files from a ZIP file.
 * @param zipFilePath - The path to the ZIP file.
 * @param fileExtension - The file extension to filter (e.g., ".png").
 * @returns A promise resolving to a map of filenames to their binary content.
 */
export async function loadAndExtractZipBinaryFiles(zipFilePath: string, fileExtension: string): Promise<Map<string, ArrayBuffer>> {
    return loadAndExtractZipFiles(zipFilePath, fileExtension, 'arraybuffer') as Promise<Map<string, ArrayBuffer>>;
}

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

export async function getFileCollections(): Promise<FileCollections> {
    const textFileExtensions = [".obj", ".urdf"];
    const binaryFileExtensions = [".png", ".STL"];

    const textFilesMap = await retrieveMergedMap(assetPath, textFileExtensions, loadAndExtractZipTextFiles);
    const binaryFilesMap = await retrieveMergedMap(assetPath, binaryFileExtensions, loadAndExtractZipBinaryFiles);

    const fileCollections: FileCollections = {
        textFiles: textFilesMap,
        binaryFiles: binaryFilesMap,
    };

    return fileCollections;
}

export async function getFileCollectionsNoThrow(): Promise<FileCollections> {
    try {
        const fileMaps = await getFileCollections();
        console.log('ZIP file loaded and extracted successfully.', fileMaps);
        return fileMaps
    } catch (error) {
        console.error('Error during ZIP loading:', error);
    }
    return { textFiles: new Map(), binaryFiles: new Map() };
}
