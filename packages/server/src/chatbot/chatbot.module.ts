import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { StateModule } from 'src/state/state.module';
import { ChatGateway } from './chatbot.gateway';
import { BullConfigurationModule } from 'src/bull-configuration/bull-configuration.module';

@Module({
  imports: [RedisModule, ConfigModule, StateModule, BullConfigurationModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, ChatGateway, SupabaseService],
})
export class ChatbotModule {}
