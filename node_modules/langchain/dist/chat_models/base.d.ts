import { BaseChatMessage, BasePromptValue, ChatResult, LLMResult } from "../schema/index.js";
import { BaseLanguageModel, BaseLanguageModelCallOptions, BaseLanguageModelParams } from "../base_language/index.js";
import { CallbackManagerForLLMRun, Callbacks } from "../callbacks/manager.js";
export type SerializedChatModel = {
    _model: string;
    _type: string;
} & Record<string, any>;
export type SerializedLLM = {
    _model: string;
    _type: string;
} & Record<string, any>;
export type BaseChatModelParams = BaseLanguageModelParams;
export type BaseChatModelCallOptions = BaseLanguageModelCallOptions;
export declare abstract class BaseChatModel extends BaseLanguageModel {
    CallOptions: BaseChatModelCallOptions;
    constructor(fields: BaseChatModelParams);
    abstract _combineLLMOutput?(...llmOutputs: LLMResult["llmOutput"][]): LLMResult["llmOutput"];
    generate(messages: BaseChatMessage[][], stop?: string[] | this["CallOptions"], callbacks?: Callbacks): Promise<LLMResult>;
    _modelType(): string;
    abstract _llmType(): string;
    generatePrompt(promptValues: BasePromptValue[], stop?: string[] | this["CallOptions"], callbacks?: Callbacks): Promise<LLMResult>;
    abstract _generate(messages: BaseChatMessage[], stop?: string[] | this["CallOptions"], runManager?: CallbackManagerForLLMRun): Promise<ChatResult>;
    call(messages: BaseChatMessage[], stop?: string[] | this["CallOptions"], callbacks?: Callbacks): Promise<BaseChatMessage>;
    callPrompt(promptValue: BasePromptValue, stop?: string[] | this["CallOptions"], callbacks?: Callbacks): Promise<BaseChatMessage>;
}
export declare abstract class SimpleChatModel extends BaseChatModel {
    abstract _call(messages: BaseChatMessage[], stop?: string[] | this["CallOptions"], runManager?: CallbackManagerForLLMRun): Promise<string>;
    _generate(messages: BaseChatMessage[], stop?: string[] | this["CallOptions"], runManager?: CallbackManagerForLLMRun): Promise<ChatResult>;
}
