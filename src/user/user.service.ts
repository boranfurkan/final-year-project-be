import { Chain } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(walletAddress: string, chain: Chain) {
    const user = await this.prisma.user.create({
      data: {
        walletAddress,
        chain,
      },
    });

    return {
      ...user,
    };
  }

  async getUser(walletAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      throw new NotFoundException(
        `User with wallet address ${walletAddress} not found`,
      );
    }

    return {
      ...user,
    };
  }

  async findOrCreateUserByWallet(walletAddress: string, chain: Chain) {
    return this.prisma.user.upsert({
      where: {
        walletAddress_chain: {
          walletAddress: walletAddress,
          chain,
        },
      },
      update: {},
      create: {
        walletAddress: walletAddress,
        chain,
      },
    });
  }

  async getUserImages(walletAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress },
      include: {
        images: {
          orderBy: {
            createdAt: 'desc', // Get newest images first
          },
        },
      },
    });

    if (!user) {
      // Return empty result instead of throwing an error for better UX
      return {
        imageUrls: [],
        count: 0,
      };
    }

    // Extract image URLs and other relevant information for each image
    const images = user.images.map((image) => ({
      url: image.url,
      prompt: image.prompt,
      createdAt: image.createdAt,
    }));

    return {
      imageUrls: user.images.map((image) => image.url),
      images: images,
      count: images.length,
    };
  }
}
