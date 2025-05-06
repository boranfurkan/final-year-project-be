import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageService } from '@/image/image.service';
import { ImageController } from '@/image/image.controller';
import { IpfsModule } from '@/ipfs/ipfs.module';
import { RunpodModule } from '@/runpod/runpod.module';

@Module({
  imports: [ConfigModule, IpfsModule, RunpodModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
