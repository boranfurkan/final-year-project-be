import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageService } from '@/image/image.service';
import { ImageController } from '@/image/image.controller';
import { IpfsModule } from '@/ipfs/ipfs.module';

@Module({
  imports: [ConfigModule, IpfsModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
