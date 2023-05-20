import { OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { SchedulerMetadataAccessor } from './schedule-metadata.accessor';
import { SchedulerOrchestrator } from './scheduler.orchestrator';
export declare class ScheduleExplorer implements OnModuleInit {
    private readonly schedulerOrchestrator;
    private readonly discoveryService;
    private readonly metadataAccessor;
    private readonly metadataScanner;
    private readonly logger;
    constructor(schedulerOrchestrator: SchedulerOrchestrator, discoveryService: DiscoveryService, metadataAccessor: SchedulerMetadataAccessor, metadataScanner: MetadataScanner);
    onModuleInit(): void;
    explore(): void;
    lookupSchedulers(instance: Record<string, Function>, key: string): void;
    warnForNonStaticProviders(wrapper: InstanceWrapper<any>, instance: Record<string, Function>, key: string): void;
    private wrapFunctionInTryCatchBlocks;
}
