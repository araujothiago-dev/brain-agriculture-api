import { Injectable, NotFoundException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCulturaDto } from '../dto/create-cultura.dto';
import { UpdateCulturaDto } from '../dto/update-cultura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultura } from '../entities/cultura.entity';
import { DataSource, Repository } from 'typeorm';
import { Safra } from 'src/safras/entities/safra.entity';
import { ResponseGeneric } from 'src/utils/response.generic';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { IdDto } from 'src/utils/id.dto';
import PerfilEnum from 'src/perfil/enums/perfil.enum';

@Injectable()
export class CulturasService {
  constructor(
    @InjectRepository(Cultura)
    private culturaRepository: Repository<Cultura>,
    private dataSource: DataSource
  ) { }

  async create(body: CreateCulturaDto) {
    try {
      const cultura = await this.culturaRepository.save(body);

      const culturaReturn = await this.culturaRepository.findOneBy({ id: cultura.id });

      if (!culturaReturn) throw 'Erro ao salvar cultura.';

      return new ResponseGeneric<Cultura>(culturaReturn);
    } catch (error) {
      if (error.code == 23505) {
        error = 'Já existe uma cultura igual a este cadastrado.'
      }

      throw new HttpException({ message: 'Não foi possível cadastrar Cultura. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll(page: number, size: number) {
    try {
      const [culturas, total] = await this.culturaRepository.findAndCount({
        loadEagerRelations: false,
        relations: {
          propriedadesSafras: true
        },
        select: ['id', 'idPublic', 'nome', 'propriedadesSafras'],
        order: {
          nome: 'ASC'
        },
        take: size || 10,
        skip: (page - 1) * (size || 10)
      });
      return new ResponseGeneric<PaginationInterface<Cultura[]>>({
        content: culturas,
        total: total,
        totalPages: Math.ceil(total / size)
      });

    } catch (error) {
      throw new HttpException({ message: 'Não foi possível buscar Culturas. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(idPublic: string) {
    try {
      const cultura = await this.culturaRepository.findOne({
        loadEagerRelations: false,
        relations: {
          propriedadesSafras: true,
        },
        where: { idPublic }
      });
      if (!cultura) throw 'Não foi encontrada Cultura com esta identificação: ' + idPublic;

      return await new ResponseGeneric<Cultura>(cultura);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível buscar Cultura. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async update(idPublic: string, body: UpdateCulturaDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const culturaReturn = await this.culturaRepository.findOneBy({
        idPublic: idPublic
      })

      if (!culturaReturn) throw 'Não foi encontrada Cultura com esta identificação: ' + idPublic;

      const bodyUpdate: Cultura = { ...culturaReturn, ...body };

      await queryRunner.manager.save(Cultura, bodyUpdate);

      const cultura = await queryRunner.manager.findOneBy(Cultura, { idPublic: idPublic });

      await queryRunner.commitTransaction();

      return new ResponseGeneric<Cultura>(cultura);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException({ message: 'Não foi possível atualizar Cultura. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(idPublic: string) {
    try {
      const cultura = await this.culturaRepository.findOneBy({
        idPublic: idPublic
      });

      if (!cultura) {
        throw 'Não foi encontrada Cultura com esta identificação: ' + idPublic;
      }

      const returnDelete = await this.culturaRepository.delete({ idPublic: idPublic }).catch(async err => {
        if (err?.code == '23503') {
          return await this.culturaRepository.softDelete({ idPublic: cultura.idPublic })
        } else {
          throw err;
        }
      });
      return new ResponseGeneric<Cultura>(null, returnDelete.affected + ' Cultura deletada com sucesso.');

    } catch (error) {
      throw new HttpException({ message: 'Não foi possível remover Cultura. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
