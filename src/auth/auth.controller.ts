import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from '@/auth/auth.service';
import { Controller, Post, Body } from '@nestjs/common';
import { Public } from '@/common/decorators/public.decorator';
import { VerifySignatureRequestDto } from '@/auth/type/dto/verify-signature.dto';
import { VerifySignatureResponse } from '@/auth/type/response/verify-signature.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Verifies the signature and returns a JWT token',
    type: VerifySignatureResponse,
  })
  async verifySignature(@Body() verifySignatureDto: VerifySignatureRequestDto) {
    const { walletAddress, nonce, signature, chain } = verifySignatureDto;
    return await this.authService.verifySignature(
      nonce,
      walletAddress,
      signature,
      chain,
    );
  }
}
