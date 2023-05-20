import { BaseChain, ChainInputs } from "./base.js";
import { BasePromptTemplate } from "../prompts/base.js";
import { BaseLanguageModel } from "../base_language/index.js";
import { ChainValues, Generation, BasePromptValue } from "../schema/index.js";
import { BaseOutputParser } from "../schema/output_parser.js";
import { SerializedLLMChain } from "./serde.js";
import { CallbackManager } from "../callbacks/index.js";
import { CallbackManagerForChainRun } from "../callbacks/manager.js";
export interface LLMChainInput extends ChainInputs {
    /** Prompt object to use */
    prompt: BasePromptTemplate;
    /** LLM Wrapper to use */
    llm: BaseLanguageModel;
    /** OutputParser to use */
    outputParser?: BaseOutputParser;
    /** Key to use for output, defaults to `text` */
    outputKey?: string;
}
/**
 * Chain to run queries against LLMs.
 *
 * @example
 * ```ts
 * import { LLMChain } from "langchain/chains";
 * import { OpenAI } from "langchain/llms/openai";
 * import { PromptTemplate } from "langchain/prompts";
 *
 * const prompt = PromptTemplate.fromTemplate("Tell me a {adjective} joke");
 * const llm = new LLMChain({ llm: new OpenAI(), prompt });
 * ```
 */
export declare class LLMChain extends BaseChain implements LLMChainInput {
    prompt: BasePromptTemplate;
    llm: BaseLanguageModel;
    outputKey: string;
    outputParser?: BaseOutputParser;
    get inputKeys(): string[];
    get outputKeys(): string[];
    constructor(fields: LLMChainInput);
    /** @ignore */
    _getFinalOutput(generations: Generation[], promptValue: BasePromptValue, runManager?: CallbackManagerForChainRun): Promise<unknown>;
    /** @ignore */
    _call(values: ChainValues, runManager?: CallbackManagerForChainRun): Promise<ChainValues>;
    /**
     * Format prompt with values and pass to LLM
     *
     * @param values - keys to pass to prompt template
     * @param callbackManager - CallbackManager to use
     * @returns Completion from LLM.
     *
     * @example
     * ```ts
     * llm.predict({ adjective: "funny" })
     * ```
     */
    predict(values: ChainValues, callbackManager?: CallbackManager): Promise<string>;
    _chainType(): "llm_chain";
    static deserialize(data: SerializedLLMChain): Promise<LLMChain>;
    serialize(): SerializedLLMChain;
}
