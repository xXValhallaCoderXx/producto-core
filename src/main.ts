import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}
bootstrap();
