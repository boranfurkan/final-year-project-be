import { ApiProperty } from '@nestjs/swagger';

export class VerifySignatureResponse {
  @ApiProperty({ description: 'JWT token for the user' })
  authToken: string;
}
