import { ApiResponse } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserResponse } from '@/user/type/response/get-me.response';
import { UserImageResponse } from '@/user/type/response/get-images.response';
import { GetWalletAddress } from '@/common/decorators/get-wallet-address.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Get user from authentication token',
    type: UserResponse,
  })
  async getMe(@GetWalletAddress() walletAddress: string) {
    return this.userService.getUser(walletAddress);
  }

  @Get('me/images')
  @ApiResponse({
    status: 200,
    description: 'Get user images',
    type: UserImageResponse,
  })
  async getImages(@GetWalletAddress() walletAddress: string) {
    return this.userService.getUserImages(walletAddress);
  }
}
