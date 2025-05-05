import { ApiProperty } from '@nestjs/swagger';
import { Chain } from '@prisma/client';
import {
  IsEnum,
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

class AttributeDto {
  @ApiProperty({
    description: 'Trait type',
    example: 'Background',
    type: String,
  })
  @IsString()
  trait_type: string;

  @ApiProperty({
    description: 'Trait value',
    example: 'Blue',
    type: String,
  })
  @IsString()
  value: string;
}

export class CreateNftMetadataDto {
  @ApiProperty({
    description: 'Blockchain to create metadata for',
    enum: Chain,
    example: 'ETH',
  })
  @IsEnum(Chain)
  chain: Chain;

  @ApiProperty({
    description: 'Name of the NFT',
    example: 'My Awesome NFT',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the NFT',
    example: 'This is a beautiful NFT created using AI',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'URL of the image (IPFS or HTTP)',
    example: 'ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    type: String,
  })
  @IsString()
  @IsUrl(
    { require_protocol: true },
    { message: 'Image URL must be a valid URL with protocol' },
  )
  imageUrl: string;

  @ApiProperty({
    description: 'Attributes/traits of the NFT',
    type: [AttributeDto],
    example: [
      { trait_type: 'Background', value: 'Blue' },
      { trait_type: 'Eyes', value: 'Green' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attributes: AttributeDto[];

  @ApiProperty({
    description: 'External URL for the NFT (optional)',
    example: 'https://myapp.com/nft/123',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUrl(
    { require_protocol: true },
    { message: 'External URL must be a valid URL with protocol' },
  )
  externalUrl?: string;
}
