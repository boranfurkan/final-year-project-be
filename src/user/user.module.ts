import { Module } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserController } from '@/user/user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
