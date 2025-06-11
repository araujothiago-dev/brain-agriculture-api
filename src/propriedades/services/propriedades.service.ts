import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePropriedadeDto } from '../dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from '../dto/update-propriedade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Propriedade } from '../entities/propriedade.entity';
import { ResponseGeneric } from 'src/utils/response.generic';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';

@Injectable()
export class PropriedadesService {
  constructor(
    @InjectRepository(Propriedade)
    private propriedadeRepository: Repository<Propriedade>,
    private dataSource: DataSource,
  ) { }

  async create(body: CreatePropriedadeDto) {
    try {

      if (body.culturas && body.culturas.length > 0) {
        body.culturas = body.culturas.map(cultura => ({
          id: cultura.id
        })) as any;
      }

      const propriedade = await this.propriedadeRepository.save(body);

      const propriedadeReturn = await this.propriedadeRepository.findOneBy({ id: propriedade.id });

      if (!propriedadeReturn) {
        throw 'Erro ao buscar a propriedade.';
      }

      return new ResponseGeneric<Propriedade>(propriedadeReturn);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível cadastrar Propriedade. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(page: number, size: number, parameter?: string) {
    try {
      const [propriedades, total]: [Propriedade[], number] = await this.propriedadeRepository.findAndCount({
        loadEagerRelations: false,
        relations: {
          produtor: true,
          culturas: {
            safra: true
          }
        },
        select: ['id', 'idPublic', 'nome', 'cidade', 'estado', 'area_total', 'area_agricultavel', 'area_vegetacao', 'ativo', 'produtor', 'culturas'],
        where: [
          {
            nome: ILike('%' + parameter + '%'),
            ativo: true,
          },
          {
            produtor: ILike('%' + parameter + '%'),
            ativo: true,
          },
          {
            culturas: {
              nome: ILike('%' + parameter + '%'),
            },
            ativo: true,
          },
          {
            cidade: ILike('%' + parameter + '%'),
            ativo: true,
          },
          {
            estado: ILike('%' + parameter + '%'),
            ativo: true,
          }
        ],
        order: {
          nome: 'ASC'
        },
        take: size || 10,
        skip: (page - 1) * (size || 10)
      });

      return new ResponseGeneric<PaginationInterface<Propriedade[]>>({
        content: propriedades,
        total: total,
        totalPages: Math.ceil(total / size)
      });
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível buscar as Propriedades. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND);
    }
  }

  async findAllByProdutor(idPublicProdutor: string) {
    try {
      const propriedades: Propriedade[] = await this.propriedadeRepository.find({
        loadEagerRelations: false,
        relations: {
          produtor: true,
          culturas: {
            safra: true
          }
        },
        select: ['id', 'idPublic', 'nome', 'cidade', 'estado', 'area_total', 'area_agricultavel', 'area_vegetacao', 'ativo', 'produtor', 'culturas'],
        where: {
          produtor: {
            idPublic: idPublicProdutor
          },
          ativo: true,
        },
        order: {
          nome: 'ASC'
        }
      });

      return new ResponseGeneric<Propriedade[]>(propriedades);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível buscar as Propriedades pelo Produtor. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND);
    }
  }

  async findOne(idPublic: string) {
    try {
      const propriedade = await this.propriedadeRepository.findOne({
        loadEagerRelations: false,
        relations: {
          produtor: true,
          culturas: {
            safra: true
          }
        },
        where: {
          idPublic: idPublic
        }
      });

      if (!propriedade) {
        throw 'Não foi encontrado Propriedade com esta identificação: ' + idPublic;
      }

      return await new ResponseGeneric<Propriedade>(propriedade);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível buscar a Propriedade. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

  async update(idPublic: string, body: UpdatePropriedadeDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const propriedadeReturne = await this.propriedadeRepository.findOneBy({
        idPublic: idPublic
      })

      if (!propriedadeReturne) {
        throw 'Não foi encontrada Propriedade com esta identificação: ' + idPublic;
      }

      const bodyUpdate: Propriedade = { ...propriedadeReturne, ...body };

      await queryRunner.manager.save(Propriedade, bodyUpdate);

      const propriedade = await queryRunner.manager.findOneBy(Propriedade, { idPublic: idPublic })

      await queryRunner.commitTransaction();

      return new ResponseGeneric<Propriedade>(propriedade);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new HttpException({ message: 'Não foi possível modificar a Propriedade. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    } finally {
      await queryRunner.release();
    }
  }

  async remove(idPublic: string) {
    try {
      const propriedadeReturn = await this.propriedadeRepository.findOne({
        where: {
          idPublic
        },
        select: ['id', 'idPublic', 'nome'],
      })

      if (!propriedadeReturn) {
        throw 'Não foi encontrada Propriedade com esta identificação: ' + idPublic;
      }

      const returnDelete = await this.propriedadeRepository.delete({ idPublic: propriedadeReturn.idPublic }).catch(async err => {
        if (err?.code == '23503') {
          await this.dataSource.manager.update(Propriedade, { idPublic }, { ativo: false });
          return await this.propriedadeRepository.softDelete({ idPublic: propriedadeReturn.idPublic })
        } else {
          throw err;
        }
      });

      return new ResponseGeneric<Propriedade>(null, returnDelete.affected + ' Propriedade deletada com sucesso.');
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível deletar a Propriedade. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }
}
