import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NftService } from '@/nft/nft.service';
import { NftController } from '@/nft/nft.controller';
import { IpfsModule } from '@/ipfs/ipfs.module';

@Module({
  imports: [ConfigModule, IpfsModule],
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
