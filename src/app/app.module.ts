import { AuthModule } from '@/auth/auth.module';
import { ImageModule } from '@/image/image.module';
import { UserModule } from '@/user/user.module';
import { NftModule } from '@/nft/nft.module';
import { IpfsModule } from '@/ipfs/ipfs.module';
import { RunpodModule } from '@/runpod/runpod.module';
import { Module } from '@nestjs/common';
import { AppController } from 'src/app/app.controller';
import { AppService } from 'src/app/app.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ImageModule,
    UserModule,
    AuthModule,
    IpfsModule,
    NftModule,
    RunpodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
