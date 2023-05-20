import { AgentRun, BaseTracer, BaseTracerSession, ChainRun, LLMRun, Run, ToolRun } from "./tracers.js";
export declare class ConsoleCallbackHandler extends BaseTracer {
    name: "console_callback_handler";
    constructor();
    i: number;
    protected persistSession(session: BaseTracerSession): Promise<{
        id: number;
        start_time: number;
        name?: string | undefined;
    }>;
    protected persistRun(_run: Run): Promise<void>;
    loadDefaultSession(): Promise<import("./tracers.js").TracerSession>;
    loadSession(sessionName: string): Promise<import("./tracers.js").TracerSession>;
    getParents(run: Run): Run[];
    getBreadcrumbs(run: Run): string;
    onChainStart(run: ChainRun): void;
    onChainEnd(run: ChainRun): void;
    onChainError(run: ChainRun): void;
    onLLMStart(run: LLMRun): void;
    onLLMEnd(run: LLMRun): void;
    onLLMError(run: LLMRun): void;
    onToolStart(run: ToolRun): void;
    onToolEnd(run: ToolRun): void;
    onToolError(run: ToolRun): void;
    onAgentAction(run: AgentRun): void;
}
