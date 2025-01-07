import { FileCollections, BlobCollections } from '../types/assetTypes';

function createBlobURI(fileName: string, content: string | ArrayBuffer, type: string): [string, string] {
    const blob = new Blob([content], { type });
    const uri = URL.createObjectURL(blob);
    return [fileName, uri];
}

export function createBlobURIs(fileCollections: FileCollections): BlobCollections {
    const createURIMap = <T extends string | ArrayBuffer>(map: Map<string, T>, type: string): Map<string, string> =>
        new Map(Array.from(map.entries()).map(([fileName, content]) => createBlobURI(fileName, content, type)));

    return {
        textFileURIs: createURIMap(fileCollections.textFiles, "text/plain"),
        binaryFileURIs: createURIMap(fileCollections.binaryFiles, "application/octet-stream"),
    };
}
