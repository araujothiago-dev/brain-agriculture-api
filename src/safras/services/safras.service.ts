import { Injectable, NotFoundException, InternalServerErrorException, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Safra } from '../entities/safra.entity';
import { CreateSafraDto } from '../dto/create-safra.dto';
import { UpdateSafraDto } from '../dto/update-safra.dto';
import { ResponseGeneric } from 'src/utils/response.generic';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';

@Injectable()
export class SafrasService {
  constructor(
    @InjectRepository(Safra)
    private safraRepository: Repository<Safra>,
        private dataSource: DataSource
  ) { }

  async create(createSafraDto: CreateSafraDto) {
    try {
      const safra = await this.safraRepository.save(createSafraDto);

      const safraReturn = await this.safraRepository.findOneBy({ id: safra.id });

      if (!safraReturn) throw 'Erro ao salvar Safra.';

      return new ResponseGeneric<Safra>(safraReturn);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível criar Safra. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(page: number, size: number) {
    try {
      const [safras, total] = await this.safraRepository.findAndCount({
        loadEagerRelations: false,
        relations: {
          propriedadesCulturas: true
        },
        select: ['id', 'idPublic', 'nome', 'propriedadesCulturas'],
        order: {
          nome: 'ASC'
        },
        take: size || 10,
        skip: (page - 1) * (size || 10)
      });
      return new ResponseGeneric<PaginationInterface<Safra[]>>({
        content: safras,
        total: total,
        totalPages: Math.ceil(total / size),
      });
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível buscar Safras. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(idPublic: string) {
    try {
      const safra = await this.safraRepository.findOne({
        loadEagerRelations: false,
        relations: {
          propriedadesCulturas: true,
        },
        where: { idPublic }
      });
      if (!safra) throw 'Não foi encontrada Safra com esta identificação: ' + idPublic;
      return new ResponseGeneric<Safra>(safra);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível buscar Safra. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async update(idPublic: string, updateSafraDto: UpdateSafraDto) {
    try {
      const result = await this.safraRepository.update(idPublic, updateSafraDto);
      if (result.affected === 0) throw new NotFoundException('Safra não encontrada');

      const safra = await this.safraRepository.findOneBy({ idPublic });

      if (!safra) throw 'Safra não foi encontrada com esta identificação: ' + idPublic;

      return new ResponseGeneric<Safra>(safra);

    } catch (error) {
      throw new HttpException({ message: 'Não foi possível atualizar Safra. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(idPublic: string) {
    try {
      const safra = await this.safraRepository.findOneBy({
        idPublic: idPublic
      });

      if (!safra) {
        throw 'Não foi encontrada Safra com esta identificação: ' + idPublic;
      }

      const returnDelete = await this.safraRepository.delete({ idPublic: idPublic }).catch(async err => {
        if (err?.code == '23503') {
          return await this.safraRepository.softDelete({ idPublic: safra.idPublic })
        } else {
          throw err;
        }
      });
      return new ResponseGeneric<Safra>(null, returnDelete.affected + ' Safra deletada com sucesso.');

    } catch (error) {
      throw new HttpException({ message: 'Não foi possível remover Safra. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
