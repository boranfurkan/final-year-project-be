import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@/auth/auth.service';
import { UserService } from '@/user/user.service';
import { CustomAuthGuard } from '@/auth/auth.guard';
import { AuthController } from '@/auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    AuthService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: CustomAuthGuard,
    },
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
