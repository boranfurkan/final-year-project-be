import { ApiProperty } from '@nestjs/swagger';

export class ImageResponse {
  @ApiProperty({
    description: 'Public URL of the generated image',
    example: 'https://example.com/image.png',
    type: String,
  })
  imageURL: string;

  @ApiProperty({
    description: 'Wallet address of the user who generated the image',
    example: '0x1234567890abcdef1234567890abcdef12345678',
    type: String,
  })
  createdBy: string;
}
