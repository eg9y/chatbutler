"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ScheduleModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const schedule_metadata_accessor_1 = require("./schedule-metadata.accessor");
const schedule_explorer_1 = require("./schedule.explorer");
const scheduler_orchestrator_1 = require("./scheduler.orchestrator");
const scheduler_registry_1 = require("./scheduler.registry");
let ScheduleModule = ScheduleModule_1 = class ScheduleModule {
    static forRoot() {
        return {
            global: true,
            module: ScheduleModule_1,
            providers: [schedule_explorer_1.ScheduleExplorer, scheduler_registry_1.SchedulerRegistry],
            exports: [scheduler_registry_1.SchedulerRegistry],
        };
    }
};
ScheduleModule = ScheduleModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [core_1.DiscoveryModule],
        providers: [schedule_metadata_accessor_1.SchedulerMetadataAccessor, scheduler_orchestrator_1.SchedulerOrchestrator],
    })
], ScheduleModule);
exports.ScheduleModule = ScheduleModule;
