"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleExplorer = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const scheduler_type_enum_1 = require("./enums/scheduler-type.enum");
const schedule_metadata_accessor_1 = require("./schedule-metadata.accessor");
const scheduler_orchestrator_1 = require("./scheduler.orchestrator");
let ScheduleExplorer = class ScheduleExplorer {
    constructor(schedulerOrchestrator, discoveryService, metadataAccessor, metadataScanner) {
        this.schedulerOrchestrator = schedulerOrchestrator;
        this.discoveryService = discoveryService;
        this.metadataAccessor = metadataAccessor;
        this.metadataScanner = metadataScanner;
        this.logger = new common_1.Logger('Scheduler');
    }
    onModuleInit() {
        this.explore();
    }
    explore() {
        const instanceWrappers = [
            ...this.discoveryService.getControllers(),
            ...this.discoveryService.getProviders(),
        ];
        instanceWrappers.forEach((wrapper) => {
            const { instance } = wrapper;
            if (!instance || !Object.getPrototypeOf(instance)) {
                return;
            }
            this.metadataScanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), (key) => wrapper.isDependencyTreeStatic()
                ? this.lookupSchedulers(instance, key)
                : this.warnForNonStaticProviders(wrapper, instance, key));
        });
    }
    lookupSchedulers(instance, key) {
        const methodRef = instance[key];
        const metadata = this.metadataAccessor.getSchedulerType(methodRef);
        switch (metadata) {
            case scheduler_type_enum_1.SchedulerType.CRON: {
                const cronMetadata = this.metadataAccessor.getCronMetadata(methodRef);
                const cronFn = this.wrapFunctionInTryCatchBlocks(methodRef, instance);
                return this.schedulerOrchestrator.addCron(cronFn, cronMetadata);
            }
            case scheduler_type_enum_1.SchedulerType.TIMEOUT: {
                const timeoutMetadata = this.metadataAccessor.getTimeoutMetadata(methodRef);
                const name = this.metadataAccessor.getSchedulerName(methodRef);
                const timeoutFn = this.wrapFunctionInTryCatchBlocks(methodRef, instance);
                return this.schedulerOrchestrator.addTimeout(timeoutFn, timeoutMetadata.timeout, name);
            }
            case scheduler_type_enum_1.SchedulerType.INTERVAL: {
                const intervalMetadata = this.metadataAccessor.getIntervalMetadata(methodRef);
                const name = this.metadataAccessor.getSchedulerName(methodRef);
                const intervalFn = this.wrapFunctionInTryCatchBlocks(methodRef, instance);
                return this.schedulerOrchestrator.addInterval(intervalFn, intervalMetadata.timeout, name);
            }
        }
    }
    warnForNonStaticProviders(wrapper, instance, key) {
        const methodRef = instance[key];
        const metadata = this.metadataAccessor.getSchedulerType(methodRef);
        switch (metadata) {
            case scheduler_type_enum_1.SchedulerType.CRON: {
                this.logger.warn(`Cannot register cron job "${wrapper.name}@${key}" because it is defined in a non static provider.`);
                break;
            }
            case scheduler_type_enum_1.SchedulerType.TIMEOUT: {
                this.logger.warn(`Cannot register timeout "${wrapper.name}@${key}" because it is defined in a non static provider.`);
                break;
            }
            case scheduler_type_enum_1.SchedulerType.INTERVAL: {
                this.logger.warn(`Cannot register interval "${wrapper.name}@${key}" because it is defined in a non static provider.`);
                break;
            }
        }
    }
    wrapFunctionInTryCatchBlocks(methodRef, instance) {
        return (...args) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield methodRef.call(instance, ...args);
            }
            catch (error) {
                this.logger.error(error);
            }
        });
    }
};
ScheduleExplorer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scheduler_orchestrator_1.SchedulerOrchestrator,
        core_1.DiscoveryService,
        schedule_metadata_accessor_1.SchedulerMetadataAccessor,
        core_1.MetadataScanner])
], ScheduleExplorer);
exports.ScheduleExplorer = ScheduleExplorer;
