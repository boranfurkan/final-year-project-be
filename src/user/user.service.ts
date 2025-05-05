import { Chain } from '@prisma/client';
import { Injectable } from '@nestjs/common';
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
      throw new Error('User not found');
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
        images: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const imageUrls = user.images.map((image) => image.url);

    return {
      imageUrls,
      count: imageUrls.length,
    };
  }
}
