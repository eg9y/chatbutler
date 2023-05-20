import { AIChatMessage, RUN_KEY, } from "../schema/index.js";
import { BaseLanguageModel, } from "../base_language/index.js";
import { getBufferString } from "../memory/base.js";
import { CallbackManager, } from "../callbacks/manager.js";
export class BaseChatModel extends BaseLanguageModel {
    constructor(fields) {
        super(fields);
    }
    async generate(messages, stop, callbacks) {
        const generations = [];
        const llmOutputs = [];
        const messageStrings = messages.map((messageList) => getBufferString(messageList));
        const callbackManager_ = await CallbackManager.configure(callbacks, this.callbacks, { verbose: this.verbose });
        const runManager = await callbackManager_?.handleLLMStart({ name: this._llmType() }, messageStrings);
        try {
            const results = await Promise.all(messages.map((messageList) => this._generate(messageList, stop, runManager)));
            for (const result of results) {
                if (result.llmOutput) {
                    llmOutputs.push(result.llmOutput);
                }
                generations.push(result.generations);
            }
        }
        catch (err) {
            await runManager?.handleLLMError(err);
            throw err;
        }
        const output = {
            generations,
            llmOutput: llmOutputs.length
                ? this._combineLLMOutput?.(...llmOutputs)
                : undefined,
        };
        await runManager?.handleLLMEnd(output);
        Object.defineProperty(output, RUN_KEY, {
            value: runManager ? { runId: runManager?.runId } : undefined,
            configurable: true,
        });
        return output;
    }
    _modelType() {
        return "base_chat_model";
    }
    async generatePrompt(promptValues, stop, callbacks) {
        const promptMessages = promptValues.map((promptValue) => promptValue.toChatMessages());
        return this.generate(promptMessages, stop, callbacks);
    }
    async call(messages, stop, callbacks) {
        const result = await this.generate([messages], stop, callbacks);
        const generations = result.generations;
        return generations[0][0].message;
    }
    async callPrompt(promptValue, stop, callbacks) {
        const promptMessages = promptValue.toChatMessages();
        return this.call(promptMessages, stop, callbacks);
    }
}
export class SimpleChatModel extends BaseChatModel {
    async _generate(messages, stop, runManager) {
        const text = await this._call(messages, stop, runManager);
        const message = new AIChatMessage(text);
        return {
            generations: [
                {
                    text: message.text,
                    message,
                },
            ],
        };
    }
}
