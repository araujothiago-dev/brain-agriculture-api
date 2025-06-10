import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

@Module({
    imports: [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DATABASE'),
          entities: ["dist/**/*.entity{.ts,.js}"],
          migrationsRun: Boolean(configService.get('RUN_MIGRATIONS')),
          migrationsTableName: 'migration',
          migrations: ["dist/config/migrations/**/*.js"],
          ssl: false,
          synchronize: Boolean(configService.get('SYNCHRONIZE')),
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          retryDelay: 3000,
          retryAttempts: 1000,
          logging: ['query', 'error'],
        })
      }),
    ],
  })
  export class DatabaseModule {}
