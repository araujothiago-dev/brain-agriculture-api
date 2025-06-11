import { Module } from '@nestjs/common';
import { SafrasService } from './services/safras.service';
import { SafrasController } from './controllers/safras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Safra } from './entities/safra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Safra])],
  controllers: [SafrasController],
  providers: [SafrasService],
  exports: [SafrasService],
})
export class SafrasModule { }
