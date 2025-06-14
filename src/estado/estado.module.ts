import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EstadoService } from './service/estado.service';
import { EstadoController } from './controller/estado.controller';
import { Estado } from './entities/estado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estado])
  ],
  controllers: [EstadoController],
  providers: [EstadoService]
})
export class EstadoModule {}
