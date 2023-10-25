import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class LocalRequestGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!this.isLocalRequest(request)) {
      throw new ForbiddenException(
        'This endpoint is accessible only from localhost.',
      );
    }
    return true;
  }

  private isLocalRequest(request: any): boolean {
    const ip = request.ip;
    return ip === '127.0.0.1' || ip === '::1';
  }
}
