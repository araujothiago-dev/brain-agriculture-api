import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedSafra } from './config/seeders/seedSafra';
import { seedCultura } from './config/seeders/seedCultura';
import { seedProdutoresPropriedades } from './config/seeders/seedProdutoresPropriedades';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dataSource = app.get(DataSource);

  if (process.env.NODE_ENV !== 'PRODUCTION') {
    await seedSafra(dataSource);
    await seedCultura(dataSource);
    await seedProdutoresPropriedades(dataSource);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
