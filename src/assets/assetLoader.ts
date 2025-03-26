import JSZip from 'jszip';

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
    try {
        const zip = await fetchAndLoadZip(zipFilePath);
        return extractFilesFromZip(zip, fileExtension, contentType);
    } catch (error) {
        logError(error, `Error processing ZIP file at ${zipFilePath}`);
        return new Map(); // Return an empty map on failure
    }
}

/**
 * Fetches a ZIP file and loads it using JSZip.
 * @param zipFilePath - The path to the ZIP file.
 * @returns A promise resolving to a JSZip instance.
 */
async function fetchAndLoadZip(zipFilePath: string): Promise<JSZip> {
    const response = await fetch(zipFilePath);
    if (!response.ok) {
        throw new Error(`Failed to load ZIP file: ${response.statusText}`);
    }
    const zipData = await response.arrayBuffer();
    return JSZip.loadAsync(zipData);
}

/**
 * Extracts files from a loaded ZIP instance based on file extension and content type.
 * @param zip - The loaded JSZip instance.
 * @param fileExtension - The file extension to filter (e.g., ".obj" or ".png").
 * @param contentType - The type of content to extract ('text' or 'arraybuffer').
 * @returns A map of filenames to their content.
 */
async function extractFilesFromZip(
    zip: JSZip,
    fileExtension: string,
    contentType: 'text' | 'arraybuffer'
): Promise<Map<string, string | ArrayBuffer>> {
    const fileMap = new Map<string, string | ArrayBuffer>();

    const fileEntries = Object.entries(zip.files).filter(
        ([fileName, file]) => file && !file.dir && fileName.endsWith(fileExtension)
    );

    for (const [fileName, file] of fileEntries) {
        const content = await file.async(contentType);
        fileMap.set(fileName, content);
    }

    return fileMap;
}

/**
 * Logs errors with optional context.
 * @param error - The error to log.
 * @param context - Additional context to log with the error.
 */
function logError(error: unknown, context: string): void {
    if (error instanceof Error) {
        console.error(`${context}: ${error.message}`);
    } else {
        console.error(`${context}: ${JSON.stringify(error)}`);
    }
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
