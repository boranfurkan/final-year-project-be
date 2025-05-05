import { ApiResponse } from '@nestjs/swagger';
import { ImageService } from '@/image/image.service';
import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { Public } from '@/common/decorators/public.decorator';
import { GenerateImageDto } from '@/image/type/dto/image-generate.dto';
import { ImageResponse } from '@/image/type/response/get-image.response';
import { GetWalletAddress } from '@/common/decorators/get-wallet-address.decorator';
import { GenerateImageResponse } from '@/image/type/response/image-generate.response';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('generate')
  @ApiResponse({
    status: 200,
    description: 'Image generate and upload',
    type: GenerateImageResponse,
  })
  async generateAndUploadImage(
    @GetWalletAddress() walletAddres: string,
    @Body() generateImageDto: GenerateImageDto,
  ) {
    const { prompt } = generateImageDto;
    const imageUrl = await this.imageService.generateAndUploadImage(
      walletAddres,
      prompt,
    );

    return imageUrl;
  }

  @Get('random-images')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Get random image urls from previous generations',
    type: [ImageResponse],
  })
  async getRandomImages() {
    return this.imageService.getRandomImagesWithCreator();
  }

  @Get('all-images')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Get all image urls from previous generations',
    type: [ImageResponse],
  })
  async getAllImages() {
    return this.imageService.getAllImagesWithCreator();
  }
}
