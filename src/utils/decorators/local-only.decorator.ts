import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { LocalRequestGuard } from './local-request.guard'; // You'll create this guard next

export function LocalOnly() {
  return applyDecorators(
    SetMetadata('localOnly', true),
    UseGuards(LocalRequestGuard),
  );
}
