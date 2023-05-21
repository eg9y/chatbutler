import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ChatbotScheduler {
  @Cron(CronExpression.EVERY_30_MINUTES)
  handleHeartbeats() {
    // check for chat sessions with no heartbeat received after X seconds
    // remove those chat sessions
  }
}
