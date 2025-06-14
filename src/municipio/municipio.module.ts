import { Module } from '@nestjs/common';
import { MunicipioService } from './service/municipio.service';
import { MunicipioController } from './controller/municipio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipio } from './entities/municipio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Municipio])
  ],
  controllers: [MunicipioController],
  providers: [MunicipioService]
})
export class MunicipioModule {}
