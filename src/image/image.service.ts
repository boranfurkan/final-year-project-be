import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ImageResponse } from '@/image/type/response/get-image.response';
import { GenerateImageResponse } from '@/image/type/response/image-generate.response';

@Injectable()
export class ImageService {
  private supabaseClient: SupabaseClient;
  private readonly runpodToken: string;
  private readonly styleToken: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const anonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    this.runpodToken = this.configService.get<string>('RUNPOD_TOKEN');
    this.styleToken = this.configService.get<string>('STYLE_TOKEN');
    this.supabaseClient = createClient(url, anonKey);
  }

  async generateAndUploadImage(
    userId: string,
    prompt: string,
  ): Promise<GenerateImageResponse> {
    try {
      const base64Image = await this.generateImageFromAI(prompt);

      const fileUid = uuidv4();
      const filePath = `${userId}/${fileUid}.png`;

      const { error } = await this.supabaseClient.storage
        .from('images')
        .upload(filePath, Buffer.from(base64Image, 'base64'), {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error('Failed to upload image to Supabase: ' + error.message);
      }

      const publicURL =
        'https://fhzycbfipxyhbbshlstw.supabase.co/storage/v1/object/public/images/' +
        filePath;

      const user = await this.prisma.user.findUnique({
        where: { walletAddress: userId },
      });
      if (!user) {
        throw new Error('User not found');
      }

      await this.prisma.image.create({
        data: {
          url: publicURL,
          userWalletAddress: user.walletAddress,
          prompt: prompt,
        },
      });

      return {
        imageURL: publicURL,
        prompt: prompt,
      }
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
      return {
        imageURL: image.url,
        createdBy: image.userWalletAddress,
      };
    });
    return imageResponses;
  }

  async getAllImagesWithCreator(): Promise<ImageResponse[]> {
    const images = await this.prisma.image.findMany();
    const imageResponses: ImageResponse[] = images.map((image) => {
      return {
        imageURL: image.url,
        createdBy: image.userWalletAddress,
      };
    });
    return imageResponses;
  }
}
