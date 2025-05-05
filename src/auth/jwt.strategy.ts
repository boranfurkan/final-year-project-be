import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const supportedChains = ['ETH', 'SUI', 'SOL'];
    if (!supportedChains.includes(payload.chain)) {
      throw new HttpException('Unsupported blockchain', HttpStatus.BAD_REQUEST);
    }

    return {
      walletAddress: payload.walletAddress,
      roles: payload.roles || [],
      chain: payload.chain,
    };
  }
}
