import { Module } from '@nestjs/common';
import { ProdutoresModule } from './produtores/produtores.module';
import { PropriedadesModule } from './propriedades/propriedades.module';
import { SafrasModule } from './safras/safras.module';
import { CulturasModule } from './culturas/culturas.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      applicationName: process.env.APPLICATION_NAME,
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: ["dist/**/*.entity{.ts,.js}"],
      // migrationsRun: Boolean(process.env.RUN_MIGRATIONS),
      // migrationsTableName: 'migration',
      // migrations: ["dist/config/migrations/**/*.js"],
      ssl: false,
      synchronize: Boolean(process.env.SYNCHRONIZE),
      // autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
      retryDelay: 3000,
      retryAttempts: 1000,
      // logging: ['query', 'error'],
    }),
    ProdutoresModule, 
    PropriedadesModule, 
    SafrasModule, 
    CulturasModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
