import { Module } from '@nestjs/common';
import { CulturasService } from './services/culturas.service';
import { CulturasController } from './controllers/culturas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cultura } from './entities/cultura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cultura])],
  controllers: [CulturasController],
  providers: [CulturasService],
  exports: [CulturasService],
})
export class CulturasModule {}
