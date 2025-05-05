import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenerateImageDto {
  @ApiProperty({
    description: 'Prompt to generate the image',
    example: 'A beautiful sunset over the mountains',
    type: String,
  })
  @IsString()
  prompt: string;
}
