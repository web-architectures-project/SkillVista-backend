import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ServicesModule } from './services/services.module';
import { ContactsModule } from './contacts/contacts.module';
import { ServiceTypesModule } from './service_types/service_types.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    ProfilesModule,
    ServicesModule,
    ContactsModule,
    ServiceTypesModule,
    ReviewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
