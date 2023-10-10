import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService],
  imports: [PrismaModule],
})
export class ContactsModule {}
