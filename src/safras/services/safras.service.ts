import { Injectable } from '@nestjs/common';
import { CreateSafraDto } from '../dto/create-safra.dto';
import { UpdateSafraDto } from '../dto/update-safra.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Safra } from '../entities/safra.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SafrasService {
  constructor(
    @InjectRepository(Safra)
    private safrasRepository: Repository<Safra>
  ) {}

  create(createSafraDto: CreateSafraDto) {
    return this.safrasRepository.save(createSafraDto);
  }

  findAll() {
    return this.safrasRepository.find();
  }

  findOne(id: number) {
    return this.safrasRepository.findOne({ 
      where: { id } 
    });
  }

  update(id: number, updateSafraDto: UpdateSafraDto) {
    return this.safrasRepository.update(id, updateSafraDto);
  }

  remove(id: number) {
    return this.safrasRepository.delete(id);
  }
}
