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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerMetadataAccessor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const schedule_constants_1 = require("./schedule.constants");
let SchedulerMetadataAccessor = class SchedulerMetadataAccessor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    getSchedulerType(target) {
        return this.reflector.get(schedule_constants_1.SCHEDULER_TYPE, target);
    }
    getSchedulerName(target) {
        return this.reflector.get(schedule_constants_1.SCHEDULER_NAME, target);
    }
    getTimeoutMetadata(target) {
        return this.reflector.get(schedule_constants_1.SCHEDULE_TIMEOUT_OPTIONS, target);
    }
    getIntervalMetadata(target) {
        return this.reflector.get(schedule_constants_1.SCHEDULE_INTERVAL_OPTIONS, target);
    }
    getCronMetadata(target) {
        return this.reflector.get(schedule_constants_1.SCHEDULE_CRON_OPTIONS, target);
    }
};
SchedulerMetadataAccessor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], SchedulerMetadataAccessor);
exports.SchedulerMetadataAccessor = SchedulerMetadataAccessor;
