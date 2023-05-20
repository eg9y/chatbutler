import { Callbacks } from "../callbacks/manager.js";
import { BasePromptValue } from "./index.js";
/** Class to parse the output of an LLM call.
 */
export declare abstract class BaseOutputParser<T = unknown> {
    /**
     * Parse the output of an LLM call.
     *
     * @param text - LLM output to parse.
     * @returns Parsed output.
     */
    abstract parse(text: string, callbacks?: Callbacks): Promise<T>;
    parseWithPrompt(text: string, _prompt: BasePromptValue, callbacks?: Callbacks): Promise<T>;
    /**
     * Return a string describing the format of the output.
     * @returns Format instructions.
     * @example
     * ```json
     * {
     *  "foo": "bar"
     * }
     * ```
     */
    abstract getFormatInstructions(): string;
    /**
     * Return the string type key uniquely identifying this class of parser
     */
    _type(): string;
}
export declare class OutputParserException extends Error {
    constructor(message: string);
}
