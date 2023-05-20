import { CreateChatCompletionRequest, ConfigurationParameters, CreateChatCompletionResponse } from "openai";
import type { AxiosRequestConfig } from "axios";
import type { StreamingAxiosConfiguration } from "../util/axios-types.js";
import { BaseChatModel, BaseChatModelCallOptions, BaseChatModelParams } from "./base.js";
import { BaseChatMessage, ChatResult } from "../schema/index.js";
import { CallbackManagerForLLMRun } from "../callbacks/manager.js";
interface TokenUsage {
    completionTokens?: number;
    promptTokens?: number;
    totalTokens?: number;
}
interface OpenAILLMOutput {
    tokenUsage: TokenUsage;
}
export interface OpenAIInput {
    /** Sampling temperature to use, between 0 and 2, defaults to 1 */
    temperature: number;
    /** Total probability mass of tokens to consider at each step, between 0 and 1, defaults to 1 */
    topP: number;
    /** Penalizes repeated tokens according to frequency */
    frequencyPenalty: number;
    /** Penalizes repeated tokens */
    presencePenalty: number;
    /** Number of chat completions to generate for each prompt */
    n: number;
    /** Dictionary used to adjust the probability of specific tokens being generated */
    logitBias?: Record<string, number>;
    /** Whether to stream the results or not. Enabling disables tokenUsage reporting */
    streaming: boolean;
    /**
     * Maximum number of tokens to generate in the completion. If not specified,
     * defaults to the maximum number of tokens allowed by the model.
     */
    maxTokens?: number;
    /** Model name to use */
    modelName: string;
    /** Holds any additional parameters that are valid to pass to {@link
     * https://platform.openai.com/docs/api-reference/completions/create |
     * `openai.create`} that are not explicitly specified on this class.
     */
    modelKwargs?: Kwargs;
    /** List of stop words to use when generating */
    stop?: string[];
    /**
     * Timeout to use when making requests to OpenAI.
     */
    timeout?: number;
}
export interface ChatOpenAICallOptions extends BaseChatModelCallOptions {
    /**
     * List of stop words to use when generating
     */
    stop?: string[];
    /**
     * Additional options to pass to the underlying axios request.
     */
    options?: AxiosRequestConfig;
}
type Kwargs = Record<string, any>;
/**
 * Wrapper around OpenAI large language models that use the Chat endpoint.
 *
 * To use you should have the `openai` package installed, with the
 * `OPENAI_API_KEY` environment variable set.
 *
 * @remarks
 * Any parameters that are valid to be passed to {@link
 * https://platform.openai.com/docs/api-reference/chat/create |
 * `openai.createCompletion`} can be passed through {@link modelKwargs}, even
 * if not explicitly available on this class.
 */
export declare class ChatOpenAI extends BaseChatModel implements OpenAIInput {
    CallOptions: ChatOpenAICallOptions;
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    n: number;
    logitBias?: Record<string, number>;
    modelName: string;
    modelKwargs?: Kwargs;
    stop?: string[];
    timeout?: number;
    streaming: boolean;
    maxTokens?: number;
    private client;
    private clientConfig;
    constructor(fields?: Partial<OpenAIInput> & BaseChatModelParams & {
        concurrency?: number;
        cache?: boolean;
        openAIApiKey?: string;
    }, configuration?: ConfigurationParameters);
    /**
     * Get the parameters used to invoke the model
     */
    invocationParams(): Omit<CreateChatCompletionRequest, "messages"> & Kwargs;
    /** @ignore */
    _identifyingParams(): {
        apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
        organization?: string | undefined;
        username?: string | undefined;
        password?: string | undefined;
        accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: string[] | undefined) => string) | ((name?: string | undefined, scopes?: string[] | undefined) => Promise<string>) | undefined;
        basePath?: string | undefined;
        baseOptions?: any;
        formDataCtor?: (new () => any) | undefined;
        stop?: import("openai").CreateChatCompletionRequestStop | undefined;
        stream?: boolean | null | undefined;
        user?: string | undefined;
        model: string;
        temperature?: number | null | undefined;
        top_p?: number | null | undefined;
        n?: number | null | undefined;
        max_tokens?: number | undefined;
        presence_penalty?: number | null | undefined;
        frequency_penalty?: number | null | undefined;
        logit_bias?: object | null | undefined;
        model_name: string;
    };
    /**
     * Get the identifying parameters for the model
     */
    identifyingParams(): {
        apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
        organization?: string | undefined;
        username?: string | undefined;
        password?: string | undefined;
        accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: string[] | undefined) => string) | ((name?: string | undefined, scopes?: string[] | undefined) => Promise<string>) | undefined;
        basePath?: string | undefined;
        baseOptions?: any;
        formDataCtor?: (new () => any) | undefined;
        stop?: import("openai").CreateChatCompletionRequestStop | undefined;
        stream?: boolean | null | undefined;
        user?: string | undefined;
        model: string;
        temperature?: number | null | undefined;
        top_p?: number | null | undefined;
        n?: number | null | undefined;
        max_tokens?: number | undefined;
        presence_penalty?: number | null | undefined;
        frequency_penalty?: number | null | undefined;
        logit_bias?: object | null | undefined;
        model_name: string;
    };
    /** @ignore */
    _generate(messages: BaseChatMessage[], stopOrOptions?: string[] | this["CallOptions"], runManager?: CallbackManagerForLLMRun): Promise<ChatResult>;
    getNumTokensFromMessages(messages: BaseChatMessage[]): Promise<{
        totalCount: number;
        countPerMessage: number[];
    }>;
    /** @ignore */
    completionWithRetry(request: CreateChatCompletionRequest, options?: StreamingAxiosConfiguration): Promise<CreateChatCompletionResponse>;
    _llmType(): string;
    /** @ignore */
    _combineLLMOutput(...llmOutputs: OpenAILLMOutput[]): OpenAILLMOutput;
}
export {};
