import { Module } from '@nestjs/common';
import { PropriedadesService } from './services/propriedades.service';
import { PropriedadesController } from './controllers/propriedades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Propriedade } from './entities/propriedade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Propriedade])],
  controllers: [PropriedadesController],
  providers: [PropriedadesService],
  exports: [PropriedadesService],
})
export class PropriedadesModule { }
