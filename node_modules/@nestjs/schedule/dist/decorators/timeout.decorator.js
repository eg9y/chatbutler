"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeout = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("util");
const scheduler_type_enum_1 = require("../enums/scheduler-type.enum");
const schedule_constants_1 = require("../schedule.constants");
/**
 * Schedules an timeout (`setTimeout`).
 */
function Timeout(nameOrTimeout, timeout) {
    const [name, timeoutValue] = (0, util_1.isString)(nameOrTimeout)
        ? [nameOrTimeout, timeout]
        : [undefined, nameOrTimeout];
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(schedule_constants_1.SCHEDULE_TIMEOUT_OPTIONS, { timeout: timeoutValue }), (0, common_1.SetMetadata)(schedule_constants_1.SCHEDULER_NAME, name), (0, common_1.SetMetadata)(schedule_constants_1.SCHEDULER_TYPE, scheduler_type_enum_1.SchedulerType.TIMEOUT));
}
exports.Timeout = Timeout;
