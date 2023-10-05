import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('NestJS x Prisma')
    .setDescription('REST API NestJS x Prisma')
    .setVersion('1.0')
    .build();

  await app.listen(3001);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
bootstrap();
