import { Reflector } from '@nestjs/core';
import { CronOptions } from './decorators';
import { SchedulerType } from './enums/scheduler-type.enum';
import { IntervalMetadata } from './interfaces/interval-metadata.interface';
import { TimeoutMetadata } from './interfaces/timeout-metadata.interface';
export declare class SchedulerMetadataAccessor {
    private readonly reflector;
    constructor(reflector: Reflector);
    getSchedulerType(target: Function): SchedulerType | undefined;
    getSchedulerName(target: Function): string | undefined;
    getTimeoutMetadata(target: Function): TimeoutMetadata | undefined;
    getIntervalMetadata(target: Function): IntervalMetadata | undefined;
    getCronMetadata(target: Function): (CronOptions & Record<'cronTime', string | Date | any>) | undefined;
}
