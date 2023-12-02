import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  imports: [PrismaModule, HttpModule],
})
export class ServicesModule {}
