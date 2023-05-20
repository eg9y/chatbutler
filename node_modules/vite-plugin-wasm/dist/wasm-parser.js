"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGlueCode = exports.parseWasm = void 0;
const fs_1 = __importDefault(require("fs"));
async function parseWasm(wasmFilePath) {
    try {
        const wasmBinary = await fs_1.default.promises.readFile(wasmFilePath);
        const wasmModule = await WebAssembly.compile(wasmBinary);
        const imports = Object.entries(WebAssembly.Module.imports(wasmModule).reduce((result, item) => ({
            ...result,
            [item.module]: [...(result[item.module] || []), item.name]
        }), {})).map(([from, names]) => ({ from, names }));
        const exports = WebAssembly.Module.exports(wasmModule).map(item => item.name);
        return { imports, exports };
    }
    catch (e) {
        throw new Error(`Failed to parse WASM file: ${e.message}`);
    }
}
exports.parseWasm = parseWasm;
async function generateGlueCode(wasmFilePath, names) {
    const { imports, exports } = await parseWasm(wasmFilePath);
    return `
${imports
        .map(({ from, names }, i) => `import { ${names.map((name, j) => `${name} as __vite__wasmImport_${i}_${j}`).join(", ")} } from ${JSON.stringify(from)};`)
        .join("\n")}
const __vite__wasmModule = await ${names.initWasm}({ ${imports
        .map(({ from, names }, i) => `${JSON.stringify(from)}: { ${names.map((name, j) => `${name}: __vite__wasmImport_${i}_${j}`).join(", ")} }`)
        .join(", ")} }, ${names.wasmUrl});
${exports
        .map(name => `export ${name === "default" ? "default" : `const ${name} =`} __vite__wasmModule.${name};`)
        .join("\n")}`;
}
exports.generateGlueCode = generateGlueCode;
