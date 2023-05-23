import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ChatbotScheduler } from './chatbot/chatbot.scheduler';
import { SupabaseService } from './supabase/supabase.service';
import { RedisModule } from './redis/redis.module';
import { StateService } from './state/state.service';
import { StateModule } from './state/state.module';

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
  ],
  controllers: [AppController],
  providers: [AppService, ChatbotScheduler, SupabaseService, StateService],
})
export class AppModule {}
