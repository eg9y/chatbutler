import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { RedisModule } from 'src/redis/redis.module';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  imports: [RedisModule, SupabaseService],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}
