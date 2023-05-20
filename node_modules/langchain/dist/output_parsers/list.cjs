"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommaSeparatedListOutputParser = exports.ListOutputParser = void 0;
const output_parser_js_1 = require("../schema/output_parser.cjs");
/**
 * Class to parse the output of an LLM call to a list.
 * @augments BaseOutputParser
 */
class ListOutputParser extends output_parser_js_1.BaseOutputParser {
}
exports.ListOutputParser = ListOutputParser;
/**
 * Class to parse the output of an LLM call as a comma-separated list.
 * @augments ListOutputParser
 */
class CommaSeparatedListOutputParser extends ListOutputParser {
    async parse(text) {
        try {
            return text
                .trim()
                .split(",")
                .map((s) => s.trim());
        }
        catch (e) {
            throw new output_parser_js_1.OutputParserException(`Could not parse output: ${text}`);
        }
    }
    getFormatInstructions() {
        return `Your response should be a list of comma separated values, eg: \`foo, bar, baz\``;
    }
}
exports.CommaSeparatedListOutputParser = CommaSeparatedListOutputParser;
