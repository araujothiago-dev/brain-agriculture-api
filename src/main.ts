import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { seeds } from './config/seeders/seed';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  if (process.env.NODE_ENV === 'DEV') {
    await seeds(dataSource);

    const config = new DocumentBuilder()
      .setTitle('brain-agriculture.api')
      .setDescription('API para agricultura de precisão')
      .setVersion('1.0')
      .setContact('AGRICULTURA', 'https://brain-agriculture.com.br', 'adminagriculturadeprecisao@brain-agriculture.com.br')
      .setLicense('Apache 2.0', 'https://www.apache.org/licenses/LICENSE-2.0.html')
      .addBearerAuth({
        type: 'http',
        bearerFormat: 'JWT',
        scheme: 'Bearer',
        in: 'header'
      }, 'access-token')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  }

  await app.listen(Number(process.env.PORT));
}
bootstrap();
