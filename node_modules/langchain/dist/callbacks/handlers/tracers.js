import { BaseCallbackHandler } from "../base.js";
export class BaseTracer extends BaseCallbackHandler {
    constructor() {
        super();
        Object.defineProperty(this, "session", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "runMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    copy() {
        return this;
    }
    async newSession(sessionName) {
        const sessionCreate = {
            start_time: Date.now(),
            name: sessionName,
        };
        const session = await this.persistSession(sessionCreate);
        this.session = session;
        return session;
    }
    _addChildRun(parentRun, childRun) {
        if (childRun.type === "llm") {
            parentRun.child_llm_runs.push(childRun);
        }
        else if (childRun.type === "chain") {
            parentRun.child_chain_runs.push(childRun);
        }
        else if (childRun.type === "tool") {
            parentRun.child_tool_runs.push(childRun);
        }
        else {
            throw new Error("Invalid run type");
        }
    }
    _startTrace(run) {
        if (run.parent_uuid) {
            const parentRun = this.runMap.get(run.parent_uuid);
            if (parentRun) {
                if (!(parentRun.type === "tool" || parentRun.type === "chain")) {
                    throw new Error("Caller run can only be a tool or chain");
                }
                else {
                    this._addChildRun(parentRun, run);
                }
            }
            else {
                throw new Error(`Caller run ${run.parent_uuid} not found`);
            }
        }
        this.runMap.set(run.uuid, run);
    }
    async _endTrace(run) {
        if (!run.parent_uuid) {
            await this.persistRun(run);
        }
        else {
            const parentRun = this.runMap.get(run.parent_uuid);
            if (parentRun === undefined) {
                throw new Error(`Parent run ${run.parent_uuid} not found`);
            }
            parentRun.child_execution_order = Math.max(parentRun.child_execution_order, run.child_execution_order);
        }
        this.runMap.delete(run.uuid);
    }
    _getExecutionOrder(parentRunId) {
        // If a run has no parent then execution order is 1
        if (parentRunId === undefined) {
            return 1;
        }
        const parentRun = this.runMap.get(parentRunId);
        if (parentRun === undefined) {
            throw new Error(`Parent run ${parentRunId} not found`);
        }
        return parentRun.child_execution_order + 1;
    }
    async handleLLMStart(llm, prompts, runId, parentRunId) {
        if (this.session === undefined) {
            this.session = await this.loadDefaultSession();
        }
        const execution_order = this._getExecutionOrder(parentRunId);
        const run = {
            uuid: runId,
            parent_uuid: parentRunId,
            start_time: Date.now(),
            end_time: 0,
            serialized: llm,
            prompts,
            session_id: this.session.id,
            execution_order,
            child_execution_order: execution_order,
            type: "llm",
        };
        this._startTrace(run);
        await this.onLLMStart?.(run);
    }
    async handleLLMEnd(output, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "llm") {
            throw new Error("No LLM run to end.");
        }
        const llmRun = run;
        llmRun.end_time = Date.now();
        llmRun.response = output;
        await this.onLLMEnd?.(llmRun);
        await this._endTrace(llmRun);
    }
    async handleLLMError(error, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "llm") {
            throw new Error("No LLM run to end.");
        }
        const llmRun = run;
        llmRun.end_time = Date.now();
        llmRun.error = error.message;
        await this.onLLMError?.(llmRun);
        await this._endTrace(llmRun);
    }
    async handleChainStart(chain, inputs, runId, parentRunId) {
        if (this.session === undefined) {
            this.session = await this.loadDefaultSession();
        }
        const execution_order = this._getExecutionOrder(parentRunId);
        const run = {
            uuid: runId,
            parent_uuid: parentRunId,
            start_time: Date.now(),
            end_time: 0,
            serialized: chain,
            inputs,
            session_id: this.session.id,
            execution_order,
            child_execution_order: execution_order,
            type: "chain",
            child_llm_runs: [],
            child_chain_runs: [],
            child_tool_runs: [],
        };
        this._startTrace(run);
        await this.onChainStart?.(run);
    }
    async handleChainEnd(outputs, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "chain") {
            throw new Error("No chain run to end.");
        }
        const chainRun = run;
        chainRun.end_time = Date.now();
        chainRun.outputs = outputs;
        await this.onChainEnd?.(chainRun);
        await this._endTrace(chainRun);
    }
    async handleChainError(error, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "chain") {
            throw new Error("No chain run to end.");
        }
        const chainRun = run;
        chainRun.end_time = Date.now();
        chainRun.error = error.message;
        await this.onChainError?.(chainRun);
        await this._endTrace(chainRun);
    }
    async handleToolStart(tool, input, runId, parentRunId) {
        if (this.session === undefined) {
            this.session = await this.loadDefaultSession();
        }
        const execution_order = this._getExecutionOrder(parentRunId);
        const run = {
            uuid: runId,
            parent_uuid: parentRunId,
            start_time: Date.now(),
            end_time: 0,
            serialized: tool,
            tool_input: input,
            session_id: this.session.id,
            execution_order,
            child_execution_order: execution_order,
            type: "tool",
            action: JSON.stringify(tool),
            child_llm_runs: [],
            child_chain_runs: [],
            child_tool_runs: [],
        };
        this._startTrace(run);
        await this.onToolStart?.(run);
    }
    async handleToolEnd(output, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "tool") {
            throw new Error("No tool run to end");
        }
        const toolRun = run;
        toolRun.end_time = Date.now();
        toolRun.output = output;
        await this.onToolEnd?.(toolRun);
        await this._endTrace(toolRun);
    }
    async handleToolError(error, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "tool") {
            throw new Error("No tool run to end");
        }
        const toolRun = run;
        toolRun.end_time = Date.now();
        toolRun.error = error.message;
        await this.onToolError?.(toolRun);
        await this._endTrace(toolRun);
    }
    async handleAgentAction(action, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "chain") {
            return;
        }
        const agentRun = run;
        agentRun.actions = agentRun.actions || [];
        agentRun.actions.push(action);
        await this.onAgentAction?.(run);
    }
}
export class LangChainTracer extends BaseTracer {
    constructor() {
        super();
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "langchain_tracer"
        });
        Object.defineProperty(this, "endpoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (typeof process !== "undefined"
                ? // eslint-disable-next-line no-process-env
                    process.env?.LANGCHAIN_ENDPOINT
                : undefined) || "http://localhost:8000"
        });
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                "Content-Type": "application/json",
            }
        });
        // eslint-disable-next-line no-process-env
        if (typeof process !== "undefined" && process.env?.LANGCHAIN_API_KEY) {
            // eslint-disable-next-line no-process-env
            this.headers["x-api-key"] = process.env?.LANGCHAIN_API_KEY;
        }
    }
    async persistRun(run) {
        let endpoint;
        if (run.type === "llm") {
            endpoint = `${this.endpoint}/llm-runs`;
        }
        else if (run.type === "chain") {
            endpoint = `${this.endpoint}/chain-runs`;
        }
        else {
            endpoint = `${this.endpoint}/tool-runs`;
        }
        const response = await fetch(endpoint, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(run),
        });
        if (!response.ok) {
            console.error(`Failed to persist run: ${response.status} ${response.statusText}`);
        }
    }
    async persistSession(sessionCreate) {
        const endpoint = `${this.endpoint}/sessions`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(sessionCreate),
        });
        if (!response.ok) {
            console.error(`Failed to persist session: ${response.status} ${response.statusText}, using default session.`);
            return {
                id: 1,
                ...sessionCreate,
            };
        }
        return {
            id: (await response.json()).id,
            ...sessionCreate,
        };
    }
    async loadSession(sessionName) {
        const endpoint = `${this.endpoint}/sessions?name=${sessionName}`;
        return this._handleSessionResponse(endpoint);
    }
    async loadDefaultSession() {
        const endpoint = `${this.endpoint}/sessions?name=default`;
        return this._handleSessionResponse(endpoint);
    }
    async _handleSessionResponse(endpoint) {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: this.headers,
        });
        let tracerSession;
        if (!response.ok) {
            console.error(`Failed to load session: ${response.status} ${response.statusText}`);
            tracerSession = {
                id: 1,
                start_time: Date.now(),
            };
            this.session = tracerSession;
            return tracerSession;
        }
        const resp = (await response.json());
        if (resp.length === 0) {
            tracerSession = {
                id: 1,
                start_time: Date.now(),
            };
            this.session = tracerSession;
            return tracerSession;
        }
        [tracerSession] = resp;
        this.session = tracerSession;
        return tracerSession;
    }
}
