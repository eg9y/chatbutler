/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { basename as BasenameT } from "node:path";
import type { readFile as ReaFileT } from "node:fs/promises";
import { DirectoryLoader, UnknownHandling } from "./directory.js";
import { Document } from "../../document.js";
import { BaseDocumentLoader } from "../base.js";
interface Element {
    type: string;
    text: string;
    metadata: {
        [key: string]: unknown;
    };
}
export declare class UnstructuredLoader extends BaseDocumentLoader {
    webPath: string;
    filePath: string;
    constructor(webPath: string, filePath: string);
    _partition(): Promise<Element[]>;
    load(): Promise<Document[]>;
    imports(): Promise<{
        readFile: typeof ReaFileT;
        basename: typeof BasenameT;
    }>;
}
export declare class UnstructuredDirectoryLoader extends DirectoryLoader {
    webPath: string;
    directoryPath: string;
    recursive: boolean;
    unknown: UnknownHandling;
    constructor(webPath: string, directoryPath: string, recursive?: boolean, unknown?: UnknownHandling);
}
export { UnknownHandling };
