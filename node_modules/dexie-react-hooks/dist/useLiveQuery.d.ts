export declare function useLiveQuery<T>(querier: () => Promise<T> | T, deps?: any[]): T | undefined;
export declare function useLiveQuery<T, TDefault>(querier: () => Promise<T> | T, deps: any[], defaultResult: TDefault): T | TDefault;
//# sourceMappingURL=useLiveQuery.d.ts.map