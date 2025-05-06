import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RunpodController } from './runpod.controller';
import { RunpodService } from './runpod.service';

@Module({
  imports: [ConfigModule],
  controllers: [RunpodController],
  providers: [RunpodService],
  exports: [RunpodService],
})
export class RunpodModule {}
