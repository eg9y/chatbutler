"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputParserException = exports.BaseOutputParser = void 0;
/** Class to parse the output of an LLM call.
 */
class BaseOutputParser {
    async parseWithPrompt(text, _prompt, callbacks) {
        return this.parse(text, callbacks);
    }
    /**
     * Return the string type key uniquely identifying this class of parser
     */
    _type() {
        throw new Error("_type not implemented");
    }
}
exports.BaseOutputParser = BaseOutputParser;
class OutputParserException extends Error {
    constructor(message) {
        super(message);
    }
}
exports.OutputParserException = OutputParserException;
