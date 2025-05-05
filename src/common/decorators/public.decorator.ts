import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'no_auth_needed';
export const Public = () => SetMetadata(PUBLIC_KEY, true);
