"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cron = void 0;
const common_1 = require("@nestjs/common");
const scheduler_type_enum_1 = require("../enums/scheduler-type.enum");
const schedule_constants_1 = require("../schedule.constants");
/**
 * Creates a scheduled job.
 * @param cronTime The time to fire off your job. This can be in the form of cron syntax or a JS ```Date``` object.
 * @param options Job execution options.
 */
function Cron(cronTime, options = {}) {
    const name = options && options.name;
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(schedule_constants_1.SCHEDULE_CRON_OPTIONS, Object.assign(Object.assign({}, options), { cronTime })), (0, common_1.SetMetadata)(schedule_constants_1.SCHEDULER_NAME, name), (0, common_1.SetMetadata)(schedule_constants_1.SCHEDULER_TYPE, scheduler_type_enum_1.SchedulerType.CRON));
}
exports.Cron = Cron;
