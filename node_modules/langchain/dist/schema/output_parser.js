/** Class to parse the output of an LLM call.
 */
export class BaseOutputParser {
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
export class OutputParserException extends Error {
    constructor(message) {
        super(message);
    }
}
