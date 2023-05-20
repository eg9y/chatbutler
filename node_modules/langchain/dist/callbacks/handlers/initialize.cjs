"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTracingCallbackHandler = void 0;
const tracers_js_1 = require("./tracers.cjs");
async function getTracingCallbackHandler(session) {
    const tracer = new tracers_js_1.LangChainTracer();
    if (session) {
        await tracer.loadSession(session);
    }
    else {
        await tracer.loadDefaultSession();
    }
    return tracer;
}
exports.getTracingCallbackHandler = getTracingCallbackHandler;
