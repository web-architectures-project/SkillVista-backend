import { Module } from '@nestjs/common';
import { ServiceTypesService } from './service_types.service';
import { ServiceTypesController } from './service_types.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ServiceTypesController],
  providers: [ServiceTypesService],
  imports: [PrismaModule],
})
export class ServiceTypesModule {}
