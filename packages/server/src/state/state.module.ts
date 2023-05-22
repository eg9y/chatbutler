import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { RedisModule } from 'src/redis/redis.module';
import { SupabaseService } from 'src/supabase/supabase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RedisModule, ConfigModule],
  providers: [StateService, SupabaseService,],
  exports: [StateService],
})
export class StateModule {}
