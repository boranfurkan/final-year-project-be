import { ApiProperty } from '@nestjs/swagger';
import { Chain } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class VerifySignatureRequestDto {
  @ApiProperty({
    description: 'Wallet address of the user',
    example: '0x1234567890abcdef1234567890abcdef12345678',
    type: String,
    required: true,
  })
  @IsString()
  walletAddress: string;

  @ApiProperty({
    description: 'Nonce generated for the user',
    example: 'random-nonce-string',
    type: String,
    required: true,
  })
  @IsString()
  nonce: string;

  @ApiProperty({
    description: 'Signature by the user',
    example: 'user-signature-string',
    type: String,
    required: true,
  })
  @IsString()
  signature: string;

  @ApiProperty({
    description: 'Chain of the user',
    example: 'ETH',
    enum: Chain,
    required: true,
  })
  @IsEnum(Chain)
  chain: Chain;
}
