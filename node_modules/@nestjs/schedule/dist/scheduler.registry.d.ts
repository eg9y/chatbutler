import { CronJob } from 'cron';
export declare class SchedulerRegistry {
    private readonly logger;
    private readonly cronJobs;
    private readonly timeouts;
    private readonly intervals;
    /**
     * @deprecated Use the `doesExist` method instead.
     */
    doesExists: (type: 'cron' | 'timeout' | 'interval', name: string) => boolean;
    doesExist(type: 'cron' | 'timeout' | 'interval', name: string): boolean;
    getCronJob(name: string): CronJob;
    getInterval(name: string): any;
    getTimeout(name: string): any;
    addCronJob(name: string, job: CronJob): void;
    addInterval<T = any>(name: string, intervalId: T): void;
    addTimeout<T = any>(name: string, timeoutId: T): void;
    getCronJobs(): Map<string, CronJob>;
    deleteCronJob(name: string): void;
    getIntervals(): string[];
    deleteInterval(name: string): void;
    getTimeouts(): string[];
    deleteTimeout(name: string): void;
    private wrapFunctionInTryCatchBlocks;
}
