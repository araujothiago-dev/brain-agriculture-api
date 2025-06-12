import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePropriedadeDto } from '../dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from '../dto/update-propriedade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Propriedade } from '../entities/propriedade.entity';
import { ResponseGeneric } from 'src/utils/response.generic';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';
import { Cultura } from 'src/culturas/entities/cultura.entity';

@Injectable()
export class PropriedadesService {
  constructor(
    @InjectRepository(Propriedade)
    private propriedadeRepository: Repository<Propriedade>,
    private dataSource: DataSource,
  ) { }

  async create(body: CreatePropriedadeDto) {
    try {
      const somaAreas = (body.area_agricultavel ?? 0) + (body.area_vegetacao ?? 0);
      if (somaAreas > (body.area_total ?? 0)) {
        throw 'A soma das áreas agricultável e de vegetação não pode ser maior que a área total.'
      }

      // if (body.culturas && body.culturas.length > 0) {
      //   const culturaRepository = this.dataSource.getRepository(Cultura);
      //   const culturasRelacionadas: Cultura[] = [];

      //   for (const cultura of body.culturas) {
      //     let culturaRelacionada: Cultura;

      //     if (cultura.id) {
      //       const culturaReturne = await culturaRepository.findOne({ where: { id: cultura.id } });
      //       if (!culturaReturne) {
      //         culturaRelacionada = await culturaRepository.save(cultura);
      //       } else {
      //         culturaRelacionada = culturaReturne;
      //       }
      //     } else {
      //       culturaRelacionada = await culturaRepository.save(cultura);
      //     }
      //     culturasRelacionadas.push(culturaRelacionada);
      //   }
      //   body.culturas = culturasRelacionadas;
      // }

      if (body.culturas?.length) {
        const culturaRepository = this.dataSource.getRepository(Cultura);

        const culturasRelacionadas = await Promise.all(
          body.culturas.map(async (cultura) => {
            if (cultura.id) {
              const existente = await culturaRepository.findOne({ where: { id: cultura.id } });
              return existente ?? await culturaRepository.save(cultura);
            }
            return await culturaRepository.save(cultura);
          })
        );

        body.culturas = culturasRelacionadas;
      }

      const propriedade = await this.propriedadeRepository.save(body);

      const propriedadeReturn = await this.propriedadeRepository.findOne({
        where: { id: propriedade.id },
        relations: {
          produtor: true,
          culturasSafras: {
            cultura: true,
            safra: true
          }
        }
      });

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
          culturasSafras: {
            cultura: true,
            safra: true
          }
        },
        select: ['id', 'idPublic', 'nome', 'cidade', 'area_total', 'area_agricultavel', 'area_vegetacao', 'ativo', 'produtor', 'culturasSafras'],
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
            culturasSafras: {
              cultura: {
                nome: ILike('%' + parameter + '%'),
              },
            },
            ativo: true,
          },
          {
            culturasSafras: {
              safra: {
                nome: ILike('%' + parameter + '%'),
              }
            },
            ativo: true,
          },
          {
            cidade: ILike('%' + parameter + '%'),
            ativo: true,
          },
          {
            cidade: {
              estado: ILike('%' + parameter + '%'),
            },
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
          culturasSafras: {
            cultura: true,
            safra: true
          }
        },
        select: ['id', 'idPublic', 'nome', 'cidade', 'area_total', 'area_agricultavel', 'area_vegetacao', 'ativo', 'produtor', 'culturasSafras'],
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
          culturasSafras: {
            cultura: true,
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
      // Validação da soma das áreas
      const somaAreas = (body.area_agricultavel ?? 0) + (body.area_vegetacao ?? 0);
      if (somaAreas > (body.area_total ?? 0)) {
        throw new HttpException(
          { message: 'A soma das áreas agricultável e de vegetação não pode ser maior que a área total.' },
          HttpStatus.BAD_REQUEST
        );
      }

      if (body.culturas?.length) {
        const culturaRepository = this.dataSource.getRepository(Cultura);

        const culturasRelacionadas = await Promise.all(
          body.culturas.map(async (cultura) => {
            if (cultura.id) {
              const existente = await culturaRepository.findOne({ where: { id: cultura.id } });
              return existente ?? await culturaRepository.save(cultura);
            }
            return await culturaRepository.save(cultura);
          })
        );

        body.culturas = culturasRelacionadas;
      }

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
      const propriedadeReturn = await this.propriedadeRepository.findOneBy({
          idPublic
      })

      if (!propriedadeReturn) {
        throw 'Não foi encontrada Propriedade com esta identificação: ' + idPublic;
      }

      const returnDelete = await this.propriedadeRepository.delete({ idPublic: propriedadeReturn.idPublic }).catch(async err => {
        if (err?.code == '23503') {
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

  async getDashboard(page: number, size: number) {
    try {
      const totalFazendas = await this.propriedadeRepository.count();

      const { totalHectares } = await this.propriedadeRepository
        .createQueryBuilder('propriedade')
        .select('SUM(propriedade.area_total)', 'totalHectares')
        .getRawOne();

      const porEstado = await this.propriedadeRepository
        .createQueryBuilder('propriedade')
        .select('propriedade.estado', 'estado')
        .addSelect('COUNT(*)', 'quantidade')
        .groupBy('propriedade.estado')
        .getRawMany();

      const porCultura = await this.propriedadeRepository
        .createQueryBuilder('propriedade')
        .leftJoin('propriedade.culturas', 'cultura')
        .select('cultura.nome', 'cultura')
        .addSelect('COUNT(DISTINCT propriedade.id)', 'quantidade')
        .groupBy('cultura.nome')
        .getRawMany();

      const { area_agricultavel, area_vegetacao } = await this.propriedadeRepository
        .createQueryBuilder('propriedade')
        .select('SUM(propriedade.area_agricultavel)', 'area_agricultavel')
        .addSelect('SUM(propriedade.area_vegetacao)', 'area_vegetacao')
        .getRawOne();

      return {
        totalFazendas,
        totalHectares: Number(totalHectares) || 0,
        porEstado,
        porCultura,
        areas: {
          area_agricultavel: Number(area_agricultavel) || 0,
          area_vegetacao: Number(area_vegetacao) || 0,
          area_total: Number(area_agricultavel) + Number(area_vegetacao) || 0
        }
      };
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível buscar o Dashboard de Propriedades. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND);
    }
  }
}
