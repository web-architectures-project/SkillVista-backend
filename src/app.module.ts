import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ServicesModule } from './services/services.module';
import { ContactsModule } from './contacts/contacts.module';
import { ServiceTypesModule } from './service_types/service_types.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProvidersModule } from './providers/providers.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    ProfilesModule,
    ServicesModule,
    ContactsModule,
    ServiceTypesModule,
    ReviewsModule,
    ProvidersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
