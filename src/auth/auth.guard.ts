import { Reflector } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, lastValueFrom } from 'rxjs';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const result = await (async () => {
      const rawResult = super.canActivate(context);
      if (rawResult instanceof Observable) {
        return lastValueFrom(rawResult);
      }
      return rawResult;
    })();

    if (!result) {
      throw new UnauthorizedException();
    }

    const { user } = request;

    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const hasRequiredRoles = requiredRoles.every((role) =>
      user?.roles?.includes(role),
    );

    if (!hasRequiredRoles) {
      throw new UnauthorizedException(
        'You do not have permission to access this route.',
      );
    }

    return true;
  }
}
