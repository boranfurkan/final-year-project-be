import * as nacl from 'tweetnacl';
import { verifyMessage } from 'ethers';
import { Chain } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { decodeUTF8 } from 'tweetnacl-util';
import { PublicKey } from '@solana/web3.js';
import { UserService } from '@/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { verifyPersonalMessageSignature } from '@mysten/sui/verify';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async verifySignature(
    nonce: string,
    walletAddress: string,
    signature: string,
    chain: Chain,
  ) {
    let isValidSignature = false;

    if (chain === 'ETH') {
      isValidSignature = await this.verifyEthereumSignature(
        walletAddress,
        nonce,
        signature,
      );
    } else if (chain === 'SOL') {
      isValidSignature = await this.verifySolanaSignature(
        walletAddress,
        nonce,
        signature,
      );
    } else if (chain === 'SUI') {
      isValidSignature = await this.verifySuiSignature(
        walletAddress,
        nonce,
        signature,
      );
    }

    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid signature or challenge');
    }

    await this.userService.findOrCreateUserByWallet(walletAddress, chain);

    const payload = {
      walletAddress,
      chain,
    };

    const jwtToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    return { authToken: jwtToken };
  }

  async verifyEthereumSignature(
    walletAddress: string,
    nonce: string,
    signature: string,
  ): Promise<boolean> {
    try {
      const recoveredAddress = verifyMessage(nonce, signature);
      return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
      console.error('Error verifying Ethereum signature:', error);
      return false;
    }
  }

  async verifySolanaSignature(
    walletAddress: string,
    nonce: string,
    signature: string,
  ): Promise<boolean> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const nonceBytes = decodeUTF8(nonce);

      const decodedSignature = base58.serialize(signature);

      const isVerified = await nacl.sign.detached.verify(
        nonceBytes,
        decodedSignature,
        publicKey.toBytes(),
      );
      return isVerified;
    } catch (error) {
      console.error('Error verifying Solana signature:', error);
      return false;
    }
  }

  async verifySuiSignature(
    walletAddress: string,
    nonce: string,
    signature: string,
  ): Promise<boolean> {
    try {
      const message = new TextEncoder().encode(nonce);
      const publicKey = await verifyPersonalMessageSignature(
        message,
        signature,
      );

      const addressFromPublicKey = publicKey.toSuiAddress();
      return addressFromPublicKey === walletAddress;
    } catch (error) {
      console.error('Error verifying Sui signature:', error);
      return false;
    }
  }
}
