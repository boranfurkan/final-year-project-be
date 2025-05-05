import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GetWalletAddress } from '@/common/decorators/get-wallet-address.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@GetWalletAddress() walletAddress: string) {
    return walletAddress;
  }
}
