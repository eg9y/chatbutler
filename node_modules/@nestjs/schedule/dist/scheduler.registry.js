"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var SchedulerRegistry_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerRegistry = void 0;
const common_1 = require("@nestjs/common");
const schedule_messages_1 = require("./schedule.messages");
let SchedulerRegistry = SchedulerRegistry_1 = class SchedulerRegistry {
    constructor() {
        this.logger = new common_1.Logger(SchedulerRegistry_1.name);
        this.cronJobs = new Map();
        this.timeouts = new Map();
        this.intervals = new Map();
        /**
         * @deprecated Use the `doesExist` method instead.
         */
        // TODO(v2): drop this.
        this.doesExists = this.doesExist;
    }
    doesExist(type, name) {
        switch (type) {
            case 'cron':
                return this.cronJobs.has(name);
            case 'interval':
                return this.intervals.has(name);
            case 'timeout':
                return this.timeouts.has(name);
            default:
                return false;
        }
    }
    getCronJob(name) {
        const ref = this.cronJobs.get(name);
        if (!ref) {
            throw new Error((0, schedule_messages_1.NO_SCHEDULER_FOUND)('Cron Job', name));
        }
        return ref;
    }
    getInterval(name) {
        const ref = this.intervals.get(name);
        if (typeof ref === 'undefined') {
            throw new Error((0, schedule_messages_1.NO_SCHEDULER_FOUND)('Interval', name));
        }
        return ref;
    }
    getTimeout(name) {
        const ref = this.timeouts.get(name);
        if (typeof ref === 'undefined') {
            throw new Error((0, schedule_messages_1.NO_SCHEDULER_FOUND)('Timeout', name));
        }
        return ref;
    }
    addCronJob(name, job) {
        const ref = this.cronJobs.get(name);
        if (ref) {
            throw new Error((0, schedule_messages_1.DUPLICATE_SCHEDULER)('Cron Job', name));
        }
        job.fireOnTick = this.wrapFunctionInTryCatchBlocks(job.fireOnTick, job);
        this.cronJobs.set(name, job);
    }
    addInterval(name, intervalId) {
        const ref = this.intervals.get(name);
        if (ref) {
            throw new Error((0, schedule_messages_1.DUPLICATE_SCHEDULER)('Interval', name));
        }
        this.intervals.set(name, intervalId);
    }
    addTimeout(name, timeoutId) {
        const ref = this.timeouts.get(name);
        if (ref) {
            throw new Error((0, schedule_messages_1.DUPLICATE_SCHEDULER)('Timeout', name));
        }
        this.timeouts.set(name, timeoutId);
    }
    getCronJobs() {
        return this.cronJobs;
    }
    deleteCronJob(name) {
        const cronJob = this.getCronJob(name);
        cronJob.stop();
        this.cronJobs.delete(name);
    }
    getIntervals() {
        return [...this.intervals.keys()];
    }
    deleteInterval(name) {
        const interval = this.getInterval(name);
        clearInterval(interval);
        this.intervals.delete(name);
    }
    getTimeouts() {
        return [...this.timeouts.keys()];
    }
    deleteTimeout(name) {
        const timeout = this.getTimeout(name);
        clearTimeout(timeout);
        this.timeouts.delete(name);
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
SchedulerRegistry = SchedulerRegistry_1 = __decorate([
    (0, common_1.Injectable)()
], SchedulerRegistry);
exports.SchedulerRegistry = SchedulerRegistry;
