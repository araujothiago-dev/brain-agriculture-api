import { Injectable } from '@nestjs/common';
import { CreateCulturaDto } from '../dto/create-cultura.dto';
import { UpdateCulturaDto } from '../dto/update-cultura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultura } from '../entities/cultura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CulturasService {
  constructor(
    @InjectRepository(Cultura)
    private culturaRepository: Repository<Cultura>
  ) { }

  create(createCulturaDto: CreateCulturaDto) {
    return this.culturaRepository.save(createCulturaDto);
  }

  findAll() {
    return this.culturaRepository.find();
  }

  findOne(id: number) {
    return this.culturaRepository.findOne({ where: { id } });
  }

  update(id: number, updateCulturaDto: UpdateCulturaDto) {
    return this.culturaRepository.update(id, updateCulturaDto);
  }

  remove(id: number) {
    return this.culturaRepository.delete(id);
  }
}
