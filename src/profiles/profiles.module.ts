import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ProfilesService, PrismaService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}
