// user-ownership.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class UserOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userIdFromParam = Number(request.params.id);
    const userIdFromToken = request.user.user_id;

    if (userIdFromParam !== userIdFromToken) {
      throw new ForbiddenException(
        "You are not authorized to access this user's data",
      );
    }

    return true;
  }
}
