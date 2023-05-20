/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { extname as ExtnameT, resolve as ResolveT } from "node:path";
import type { readdir as ReaddirT } from "node:fs/promises";
import { Document } from "../../document.js";
import { BaseDocumentLoader } from "../base.js";
export declare const UnknownHandling: {
    readonly Ignore: "ignore";
    readonly Warn: "warn";
    readonly Error: "error";
};
export type UnknownHandling = (typeof UnknownHandling)[keyof typeof UnknownHandling];
export declare class DirectoryLoader extends BaseDocumentLoader {
    directoryPath: string;
    loaders: {
        [extension: string]: (filePath: string) => BaseDocumentLoader;
    };
    recursive: boolean;
    unknown: UnknownHandling;
    constructor(directoryPath: string, loaders: {
        [extension: string]: (filePath: string) => BaseDocumentLoader;
    }, recursive?: boolean, unknown?: UnknownHandling);
    load(): Promise<Document[]>;
    static imports(): Promise<{
        readdir: typeof ReaddirT;
        extname: typeof ExtnameT;
        resolve: typeof ResolveT;
    }>;
}
