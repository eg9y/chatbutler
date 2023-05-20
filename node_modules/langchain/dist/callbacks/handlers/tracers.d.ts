import { AgentAction, ChainValues, LLMResult } from "../../schema/index.js";
import { BaseCallbackHandler } from "../base.js";
export type RunType = "llm" | "chain" | "tool";
export interface BaseTracerSession {
    start_time: number;
    name?: string;
}
export type TracerSessionCreate = BaseTracerSession;
export interface TracerSession extends BaseTracerSession {
    id: number;
}
export interface BaseRun {
    uuid: string;
    parent_uuid?: string;
    start_time: number;
    end_time: number;
    execution_order: number;
    child_execution_order: number;
    serialized: {
        name: string;
    };
    session_id: number;
    error?: string;
    type: RunType;
}
export interface LLMRun extends BaseRun {
    prompts: string[];
    response?: LLMResult;
}
export interface ChainRun extends BaseRun {
    inputs: ChainValues;
    outputs?: ChainValues;
    child_llm_runs: LLMRun[];
    child_chain_runs: ChainRun[];
    child_tool_runs: ToolRun[];
}
export interface AgentRun extends ChainRun {
    actions: AgentAction[];
}
export interface ToolRun extends BaseRun {
    tool_input: string;
    output?: string;
    action: string;
    child_llm_runs: LLMRun[];
    child_chain_runs: ChainRun[];
    child_tool_runs: ToolRun[];
}
export type Run = LLMRun | ChainRun | ToolRun;
export declare abstract class BaseTracer extends BaseCallbackHandler {
    protected session?: TracerSession;
    protected runMap: Map<string, Run>;
    protected constructor();
    copy(): this;
    abstract loadSession(sessionName: string): Promise<TracerSession>;
    abstract loadDefaultSession(): Promise<TracerSession>;
    protected abstract persistRun(run: Run): Promise<void>;
    protected abstract persistSession(session: TracerSessionCreate): Promise<TracerSession>;
    newSession(sessionName?: string): Promise<TracerSession>;
    protected _addChildRun(parentRun: ChainRun | ToolRun, childRun: Run): void;
    protected _startTrace(run: Run): void;
    protected _endTrace(run: Run): Promise<void>;
    protected _getExecutionOrder(parentRunId: string | undefined): number;
    handleLLMStart(llm: {
        name: string;
    }, prompts: string[], runId: string, parentRunId?: string): Promise<void>;
    handleLLMEnd(output: LLMResult, runId: string): Promise<void>;
    handleLLMError(error: Error, runId: string): Promise<void>;
    handleChainStart(chain: {
        name: string;
    }, inputs: ChainValues, runId: string, parentRunId?: string): Promise<void>;
    handleChainEnd(outputs: ChainValues, runId: string): Promise<void>;
    handleChainError(error: Error, runId: string): Promise<void>;
    handleToolStart(tool: {
        name: string;
    }, input: string, runId: string, parentRunId?: string): Promise<void>;
    handleToolEnd(output: string, runId: string): Promise<void>;
    handleToolError(error: Error, runId: string): Promise<void>;
    handleAgentAction(action: AgentAction, runId: string): Promise<void>;
    onLLMStart?(run: LLMRun): void | Promise<void>;
    onLLMEnd?(run: LLMRun): void | Promise<void>;
    onLLMError?(run: LLMRun): void | Promise<void>;
    onChainStart?(run: ChainRun): void | Promise<void>;
    onChainEnd?(run: ChainRun): void | Promise<void>;
    onChainError?(run: ChainRun): void | Promise<void>;
    onToolStart?(run: ToolRun): void | Promise<void>;
    onToolEnd?(run: ToolRun): void | Promise<void>;
    onToolError?(run: ToolRun): void | Promise<void>;
    onAgentAction?(run: AgentRun): void | Promise<void>;
}
export declare class LangChainTracer extends BaseTracer {
    name: string;
    protected endpoint: string;
    protected headers: Record<string, string>;
    constructor();
    protected persistRun(run: LLMRun | ChainRun | ToolRun): Promise<void>;
    protected persistSession(sessionCreate: TracerSessionCreate): Promise<TracerSession>;
    loadSession(sessionName: string): Promise<TracerSession>;
    loadDefaultSession(): Promise<TracerSession>;
    private _handleSessionResponse;
}
