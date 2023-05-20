import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { CronOptions } from './decorators/cron.decorator';
import { SchedulerRegistry } from './scheduler.registry';
export declare class SchedulerOrchestrator implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly schedulerRegistry;
    private readonly cronJobs;
    private readonly timeouts;
    private readonly intervals;
    constructor(schedulerRegistry: SchedulerRegistry);
    onApplicationBootstrap(): void;
    onApplicationShutdown(): void;
    mountIntervals(): void;
    mountTimeouts(): void;
    mountCron(): void;
    clearTimeouts(): void;
    clearIntervals(): void;
    closeCronJobs(): void;
    addTimeout(methodRef: Function, timeout: number, name?: string): void;
    addInterval(methodRef: Function, timeout: number, name?: string): void;
    addCron(methodRef: Function, options: CronOptions & Record<'cronTime', string | Date | any>): void;
}
