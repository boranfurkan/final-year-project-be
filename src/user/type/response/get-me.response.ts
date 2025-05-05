import { Chain } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'User wallet address',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  walletAddress: string;

  @ApiProperty({
    description: 'User chain',
    enum: Chain,
    example: 'ETH',
  })
  chain: Chain;

  @ApiProperty({
    description: 'User creation date',
    example: '2025-05-02T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last updated date',
    example: '2025-05-02T14:22:11.123Z',
  })
  updatedAt: Date;
}
