import { Module } from '@nestjs/common';
import { ProdutoresModule } from './produtores/produtores.module';
import { PropriedadesModule } from './propriedades/propriedades.module';
import { SafrasModule } from './safras/safras.module';
import { CulturasModule } from './culturas/culturas.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EstadoModule } from './estado/estado.module';
import { MunicipioModule } from './municipio/municipio.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { PerfilModule } from './perfil/perfil.module';
import { PermissionModule } from './permission/permission.module';
import { DashboardModule } from './dashboard/dashboard.module';

require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      applicationName: process.env.APPLICATION_NAME,
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: ["dist/**/*.entity{.ts,.js}"],
      ssl: false,
      namingStrategy: new SnakeNamingStrategy(),
      migrations: ["dist/config/migrations/**/*.js"],
      migrationsTableName: 'migration',
      migrationsRun: Boolean(process.env.RUN_MIGRATIONS),
      synchronize: Boolean(process.env.SYNCHRONIZE),
      autoLoadEntities: true,
      retryDelay: 3000,
      retryAttempts: 1000,
      // logging: ['query', 'error'],
    }),
    ProdutoresModule, 
    PropriedadesModule, 
    SafrasModule, 
    CulturasModule,
    EstadoModule,
    MunicipioModule,
    PerfilModule,
    PermissionModule,
    UsuarioModule,
    AuthModule,
    DashboardModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
