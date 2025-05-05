import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { IpfsService } from '@/ipfs/ipfs.service';
import { Chain } from '@prisma/client';

interface NftMetadataRequest {
  name: string;
  description: string;
  imageUrl: string;
  attributes: Array<{ trait_type: string; value: string }>;
  externalUrl?: string;
}

@Injectable()
export class NftService {
  private readonly appBaseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly ipfsService: IpfsService,
  ) {
    this.appBaseUrl =
      this.configService.get<string>('APP_BASE_URL') || 'https://yourapp.com';
  }

  async createNftMetadata(
    userId: string,
    chain: Chain,
    metadataRequest: NftMetadataRequest,
  ): Promise<{ metadataUrl: string; gatewayUrl: string }> {
    try {
      let metadata: any;

      switch (chain) {
        case 'ETH':
          metadata = this.createEthereumMetadata(userId, metadataRequest);
          break;
        case 'SOL':
          metadata = this.createSolanaMetadata(userId, metadataRequest);
          break;
        case 'SUI':
          metadata = this.createSuiMetadata(userId, metadataRequest);
          break;
        default:
          throw new Error(`Unsupported chain: ${chain}`);
      }

      // Upload metadata to IPFS
      const metadataName = `${userId}-${chain}-${Date.now()}`;
      const ipfsUrl = await this.ipfsService.uploadJSONToIPFS(
        metadata,
        metadataName,
      );
      const gatewayUrl = this.ipfsService.convertToGatewayURL(ipfsUrl);

      return {
        metadataUrl: ipfsUrl,
        gatewayUrl: gatewayUrl,
      };
    } catch (error) {
      console.error('Error creating NFT metadata:', error);
      throw new Error('Failed to create NFT metadata');
    }
  }

  private createEthereumMetadata(
    walletAddress: string,
    request: NftMetadataRequest,
  ): any {
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    return {
      name: request.name,
      description: request.description,
      image: request.imageUrl,
      external_url: request.externalUrl || this.appBaseUrl,
      attributes: request.attributes || [],
      creator: walletAddress,
      created_date: currentDate,
    };
  }

  private createSolanaMetadata(
    walletAddress: string,
    request: NftMetadataRequest,
  ): any {
    return {
      name: request.name,
      description: request.description,
      image: request.imageUrl,
      external_url: request.externalUrl || this.appBaseUrl,
      attributes: request.attributes || [],
      properties: {
        files: [
          {
            uri: request.imageUrl,
            type: 'image/png',
          },
        ],
        category: 'image',
        creators: [
          {
            address: walletAddress,
            share: 100,
          },
        ],
      },
    };
  }

  private createSuiMetadata(
    walletAddress: string,
    request: NftMetadataRequest,
  ): any {
    return {
      name: request.name,
      description: request.description,
      image_url: request.imageUrl,
      link: request.externalUrl || this.appBaseUrl,
      creator: request.name, // Using name as creator name since there's no actual name in request
      creator_address: walletAddress,
      attributes: request.attributes || [],
    };
  }
}
