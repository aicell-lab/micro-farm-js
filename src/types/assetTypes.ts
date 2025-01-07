
export interface FileCollections {
    textFiles: Map<string, string>;
    binaryFiles: Map<string, ArrayBuffer>;
}

export interface BlobCollections {
    textFileURIs: Map<string, string>;
    binaryFileURIs: Map<string, string>;
}

