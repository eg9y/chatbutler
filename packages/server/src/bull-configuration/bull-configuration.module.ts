import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StateModule } from 'src/state/state.module';

@Global()
@Module({
  imports: [
    StateModule,
    BullModule.registerQueueAsync({
      name: 'runNode',
      useFactory: (configService: ConfigService): BullModuleOptions => {
        if (configService.get<string>('ENV') === 'prod') {
          return {
            redis: {
              host: configService.get<string>('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT'),
              password: configService.get<string>('REDIS_PASSWORD'),
            },
          };
        } else {
          return {
            redis: {
              host: configService.get<string>('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT'),
            },
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [BullModule],
})
export class BullConfigurationModule {}
