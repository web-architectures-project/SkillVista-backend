import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  imports: [PrismaModule],
})
export class ProvidersModule {}
