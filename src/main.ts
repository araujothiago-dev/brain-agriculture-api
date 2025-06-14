import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedSafra } from './config/seeders/seedSafra';
import { seedCultura } from './config/seeders/seedCultura';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { seedProdutores } from './config/seeders/seedProdutores';
import { seedPropriedades } from './config/seeders/seedPropriedades';

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

  // if (process.env.NODE_ENV !== 'PRODUCTION') {
  //   await seedSafra(dataSource);
  //   await seedCultura(dataSource);
  //   await seedProdutores(dataSource);
  //   await seedPropriedades(dataSource); 
  // }

  await app.listen(Number(process.env.PORT));
}
bootstrap();
