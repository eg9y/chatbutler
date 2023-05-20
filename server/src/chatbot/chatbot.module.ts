import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule, ConfigModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, SupabaseService],
})
export class ChatbotModule {}
