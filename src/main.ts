import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { seeds } from './config/seeders/seed';
import { HttpExceptionFilter } from './utils/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*'
    }
  });

  const dataSource = app.get(DataSource);

  app.useGlobalFilters(new HttpExceptionFilter)

  await app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: false
    }),
  );

  if (process.env.NODE_ENV !== 'PRODUCTION') {
    await seeds(dataSource);
  }

  await app.listen(Number(process.env.PORT));
}
bootstrap();
