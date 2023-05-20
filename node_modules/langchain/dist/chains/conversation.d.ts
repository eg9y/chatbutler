import { LLMChain, LLMChainInput } from "./llm_chain.js";
import { Optional } from "../types/type-utils.js";
export declare class ConversationChain extends LLMChain {
    constructor({ prompt, outputKey, memory, ...rest }: Optional<LLMChainInput, "prompt">);
}
