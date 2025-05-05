import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { IpfsService } from '@/ipfs/ipfs.service';
import { ImageResponse } from '@/image/type/response/get-image.response';
import { GenerateImageResponse } from '@/image/type/response/image-generate.response';

@Injectable()
export class ImageService {
  private readonly runpodToken: string;
  private readonly styleToken: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly ipfsService: IpfsService,
  ) {
    this.runpodToken = this.configService.get<string>('RUNPOD_TOKEN');
    this.styleToken = this.configService.get<string>('STYLE_TOKEN');
  }

  async generateAndUploadImage(
    userId: string,
    prompt: string,
  ): Promise<GenerateImageResponse> {
    try {
      const base64Image = await this.generateImageFromAI(prompt);

      // Convert base64 to buffer
      const fileBuffer = Buffer.from(base64Image, 'base64');
      const fileName = `${userId}-${uuidv4()}.png`;

      // Upload to IPFS
      const ipfsUrl = await this.ipfsService.uploadFileToIPFS(
        fileBuffer,
        fileName,
      );

      // Convert IPFS URL to HTTP gateway URL for easier access
      const gatewayUrl = this.ipfsService.convertToGatewayURL(ipfsUrl);

      // Save to database
      const user = await this.prisma.user.findUnique({
        where: { walletAddress: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      await this.prisma.image.create({
        data: {
          url: ipfsUrl, // Store the IPFS URL
          userWalletAddress: user.walletAddress,
          prompt: prompt,
        },
      });

      return {
        imageURL: gatewayUrl, // Return the HTTP gateway URL for frontend display
        prompt: prompt,
      };
    } catch (error) {
      console.error('Error generating or uploading image:', error);
      throw new Error('Image generation or upload failed');
    }
  }

  private async generateImageFromAI(prompt: string): Promise<string> {
    const fullPrompt = `${prompt}, ${this.styleToken}`;
    const endpoint = 'https://api.runpod.ai/v2/6r9rhoebuiba2n/runsync';
    const randomSeed = Math.floor(Math.random() * 51) + 1;

    const payload = {
      input: {
        prompt: fullPrompt,
        negative_prompt: '',
        num_outputs: 1,
        num_inference_steps: 25,
        guidance_scale: 7.5,
        seed: randomSeed,
      },
    };

    try {
      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${this.runpodToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 600000,
      });

      const data = response.data;

      if (!data || data.status !== 'COMPLETED' || !data.output?.length) {
        throw new Error('AI image generation failed or incomplete');
      }

      const base64Image = data.output[0].image;

      if (!base64Image) {
        throw new Error('No image data found in response');
      }

      return base64Image;
    } catch (error) {
      console.error('Error calling AI endpoint:', error.message || error);
      throw new Error('Failed to call AI endpoint');
    }
  }

  async getRandomImagesWithCreator(): Promise<ImageResponse[]> {
    const result = await this.prisma.$queryRaw<
      {
        url: string;
        userWalletAddress: string;
        prompt: string;
      }[]
    >`
      SELECT 
        *
      FROM 
        "Image" 
      ORDER BY 
        RANDOM() 
      LIMIT 10;
    `;

    const imageResponses: ImageResponse[] = result.map((image) => {
      // Convert IPFS URLs to HTTP gateway URLs
      const displayUrl = image.url.startsWith('ipfs://')
        ? this.ipfsService.convertToGatewayURL(image.url)
        : image.url;

      return {
        imageURL: displayUrl,
        createdBy: image.userWalletAddress,
        prompt: image.prompt,
      };
    });
    return imageResponses;
  }

  async getAllImagesWithCreator(): Promise<ImageResponse[]> {
    const images = await this.prisma.image.findMany();
    const imageResponses: ImageResponse[] = images.map((image) => {
      // Convert IPFS URLs to HTTP gateway URLs
      const displayUrl = image.url.startsWith('ipfs://')
        ? this.ipfsService.convertToGatewayURL(image.url)
        : image.url;

      return {
        imageURL: displayUrl,
        createdBy: image.userWalletAddress,
        prompt: image.prompt,
      };
    });
    return imageResponses;
  }
}
