import { LangChainTracer } from "./tracers.js";
export async function getTracingCallbackHandler(session) {
    const tracer = new LangChainTracer();
    if (session) {
        await tracer.loadSession(session);
    }
    else {
        await tracer.loadDefaultSession();
    }
    return tracer;
}
