import { ApiProperty } from '@nestjs/swagger';

export class GenerateImageResponse {
  @ApiProperty({
    description: 'Public URL of the generated image',
    example: 'https://example.com/image.png',
    type: String,
  })
  imageURL: string;

  @ApiProperty({
    description: 'Prompt used to generate the image',
    example: 'A beautiful sunset over the mountains',
    type: String,
  })
  prompt: string;
}
