import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../guards/JwtAuth.guard';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const user: JwtPayload | undefined = ctx.switchToHttp().getRequest().user;
    return data && user ? user[data] : user;
  },
);
