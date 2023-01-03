import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { META_ROLES_NAME } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';
@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.reflector.get(META_ROLES_NAME, context.getHandler());
    if (!roles || roles.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user) throw new BadRequestException('User not found in request');
    let isValidUser: boolean = false;
    user.roles.forEach(role => {
      if (roles.includes(role)) {
        isValidUser = true;
        return true;
      }
    });
    return isValidUser;
  }
}
