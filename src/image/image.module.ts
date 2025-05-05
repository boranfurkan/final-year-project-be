import { Module } from '@nestjs/common';
import { ImageService } from '@/image/image.service';
import { ImageController } from '@/image/image.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
