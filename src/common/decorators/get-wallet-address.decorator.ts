import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetWalletAddress = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.walletAddress;
  },
);
