import JSZip from 'jszip';

export interface FileCollections {
    textFiles: Map< string, string >;
    binaryFiles: Map< string, ArrayBuffer >;
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

export async function getFileCollections(): Promise<FileCollections> {
    const zipFilePath = './assets.zip';
    const textFilesMap = await loadAndExtractZipTextFiles(zipFilePath, ".obj");
    const pngFilesMap = await loadAndExtractZipBinaryFiles(zipFilePath, ".png");
    const mergedBinaryFiles = mergeMaps(pngFilesMap);

    const fileCollections: FileCollections = {
        textFiles: textFilesMap,
        binaryFiles: mergedBinaryFiles,
    };

    return fileCollections;
}