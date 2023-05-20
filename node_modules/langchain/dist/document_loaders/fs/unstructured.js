import { DirectoryLoader, UnknownHandling } from "./directory.js";
import { getEnv } from "../../util/env.js";
import { Document } from "../../document.js";
import { BaseDocumentLoader } from "../base.js";
export class UnstructuredLoader extends BaseDocumentLoader {
    constructor(webPath, filePath) {
        super();
        Object.defineProperty(this, "webPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: webPath
        });
        Object.defineProperty(this, "filePath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: filePath
        });
        this.filePath = filePath;
        this.webPath = webPath;
    }
    async _partition() {
        const { readFile, basename } = await this.imports();
        const buffer = await readFile(this.filePath);
        const fileName = basename(this.filePath);
        // I'm aware this reads the file into memory first, but we have lots of work
        // to do on then consuming Documents in a streaming fashion anyway, so not
        // worried about this for now.
        const formData = new FormData();
        formData.append("files", new Blob([buffer]), fileName);
        const response = await fetch(this.webPath, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`Failed to partition file ${this.filePath} with error ${response.status} and message ${await response.text()}`);
        }
        const elements = await response.json();
        if (!Array.isArray(elements)) {
            throw new Error(`Expected partitioning request to return an array, but got ${elements}`);
        }
        return elements.filter((el) => typeof el.text === "string");
    }
    async load() {
        const elements = await this._partition();
        const documents = [];
        for (const element of elements) {
            const { metadata, text } = element;
            documents.push(new Document({
                pageContent: text,
                metadata: {
                    ...metadata,
                    category: element.type,
                },
            }));
        }
        return documents;
    }
    async imports() {
        try {
            const { readFile } = await import("node:fs/promises");
            const { basename } = await import("node:path");
            return { readFile, basename };
        }
        catch (e) {
            console.error(e);
            throw new Error(`Failed to load fs/promises. TextLoader available only on environment 'node'. It appears you are running environment '${getEnv()}'. See https://<link to docs> for alternatives.`);
        }
    }
}
export class UnstructuredDirectoryLoader extends DirectoryLoader {
    constructor(webPath, directoryPath, recursive = true, unknown = UnknownHandling.Warn) {
        const loaders = {
            ".txt": (p) => new UnstructuredLoader(webPath, p),
            ".text": (p) => new UnstructuredLoader(webPath, p),
            ".pdf": (p) => new UnstructuredLoader(webPath, p),
            ".docx": (p) => new UnstructuredLoader(webPath, p),
            ".doc": (p) => new UnstructuredLoader(webPath, p),
            ".jpg": (p) => new UnstructuredLoader(webPath, p),
            ".jpeg": (p) => new UnstructuredLoader(webPath, p),
            ".eml": (p) => new UnstructuredLoader(webPath, p),
            ".html": (p) => new UnstructuredLoader(webPath, p),
            ".md": (p) => new UnstructuredLoader(webPath, p),
            ".pptx": (p) => new UnstructuredLoader(webPath, p),
            ".ppt": (p) => new UnstructuredLoader(webPath, p),
            ".msg": (p) => new UnstructuredLoader(webPath, p),
        };
        super(directoryPath, loaders, recursive, unknown);
        Object.defineProperty(this, "webPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: webPath
        });
        Object.defineProperty(this, "directoryPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: directoryPath
        });
        Object.defineProperty(this, "recursive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: recursive
        });
        Object.defineProperty(this, "unknown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: unknown
        });
    }
}
export { UnknownHandling };
