import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ChatbotScheduler } from './chatbot/chatbot.scheduler';
import { SupabaseService } from './supabase/supabase.service';
import { RedisModule } from './redis/redis.module';
import { StateService } from './state/state.service';
import { StateModule } from './state/state.module';
import { ChatbotService } from './chatbot/chatbot.service';
import { RunNodeProcessor } from './bull-configuration/runnode.processor';
import { ChatGateway } from './chatbot/chatbot.gateway';
import { BullConfigurationModule } from './bull-configuration/bull-configuration.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, // This makes the ConfigModule global
      cache: true,
      envFilePath: '.env',
    }),
    ChatbotModule,
    RedisModule,
    StateModule,
    BullConfigurationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ChatbotScheduler,
    SupabaseService,
    StateService,
    ChatbotService,
    ChatGateway,
    RunNodeProcessor,
  ],
})
export class AppModule {}
