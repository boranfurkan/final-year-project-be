import { ApiProperty } from '@nestjs/swagger';
import { Chain } from '@prisma/client';

export class NftMetadataResponse {
  @ApiProperty({
    description: 'IPFS URL of the uploaded metadata',
    example: 'ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    type: String,
  })
  metadataUrl: string;

  @ApiProperty({
    description: 'HTTP gateway URL of the uploaded metadata for easier access',
    example:
      'https://gateway.pinata.cloud/ipfs/QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    type: String,
  })
  gatewayUrl: string;

  @ApiProperty({
    description: 'Blockchain the metadata was created for',
    enum: Chain,
    example: 'ETH',
  })
  chain: Chain;
}
