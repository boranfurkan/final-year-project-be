import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { NftService } from '@/nft/nft.service';
import { CreateNftMetadataDto } from '@/nft/type/dto/create-nft-metadata.dto';
import { NftMetadataResponse } from '@/nft/type/response/nft-metadata.response';
import { GetWalletAddress } from '@/common/decorators/get-wallet-address.decorator';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post('metadata')
  @ApiResponse({
    status: 200,
    description: 'Create and upload NFT metadata to IPFS',
    type: NftMetadataResponse,
  })
  async createNftMetadata(
    @GetWalletAddress() walletAddress: string,
    @Body() createNftMetadataDto: CreateNftMetadataDto,
  ): Promise<NftMetadataResponse> {
    const { chain, name, description, imageUrl, attributes, externalUrl } =
      createNftMetadataDto;

    const result = await this.nftService.createNftMetadata(
      walletAddress,
      chain,
      {
        name,
        description,
        imageUrl,
        attributes,
        externalUrl,
      },
    );

    return {
      metadataUrl: result.metadataUrl,
      gatewayUrl: result.gatewayUrl,
      chain,
    };
  }
}
