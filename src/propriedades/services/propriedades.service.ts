import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePropriedadeDto } from '../dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from '../dto/update-propriedade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Propriedade } from '../entities/propriedade.entity';
import { ResponseGeneric } from 'src/utils/response.generic';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';
import { Cultura } from 'src/culturas/entities/cultura.entity';
import { Produtor } from 'src/produtores/entities/produtor.entity';
import { PropriedadeCulturaSafra } from 'src/propriedadeCulturaSafra/propriedadeCulturaSafra.entity';
import { Safra } from 'src/safras/entities/safra.entity';

@Injectable()
export class PropriedadesService {
  constructor(
    @InjectRepository(Propriedade)
    private propriedadeRepository: Repository<Propriedade>,
    private dataSource: DataSource,
  ) { }

  async create(body: CreatePropriedadeDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {

      const somaAreas = (body.areaAgricultavel ?? 0) + (body.areaVegetacao ?? 0);
      if (somaAreas > (body.areaTotal ?? 0)) {
        throw 'A soma das áreas agricultável e de vegetação não pode ser maior que a área total.'
      }

      const propriedadeExistente = await this.propriedadeRepository.findOne({
        where: { matricula: body.matricula }
      });

      if (propriedadeExistente) {
        throw 'Já existe uma propriedade com esta matrícula de imóvel.';
      }

      if (body.produtor) {

        const produtorExistente = await this.dataSource.getRepository(Produtor).findOne({ where: { id: body.produtor.id } });

        if (!produtorExistente) {
          throw 'Produtor não encontrado.';
        }
      }

      if (body.culturas?.length) {
        const culturaRepository = this.dataSource.getRepository(Cultura);

        await Promise.all(
          body.culturas.map(async (cultura) => {
            const culturaId = cultura.culturaId.id;
            if (cultura.culturaId) {
              const existente = await culturaRepository.findOne({ where: { id: culturaId } });
              return existente ?? await culturaRepository.save({ id: culturaId });
            }
            return await culturaRepository.save({
              id: cultura.culturaId,
              safras: cultura.safrasId,
            });
          })
        );
      }

      const propriedade = await queryRunner.manager.save(Propriedade, body);

      await queryRunner.commitTransaction();

      if (body.culturas?.length) {
        const pcsRepository = this.dataSource.getRepository(PropriedadeCulturaSafra);
        const culturaRepository = this.dataSource.getRepository(Cultura);
        const safraRepository = this.dataSource.getRepository(Safra);

        for (const culturaInput of body.culturas) {
          const cultura = await culturaRepository.findOne({ where: { id: culturaInput.culturaId.id } });
          if (!cultura) {
            throw `Cultura de ID ${culturaInput.culturaId} não encontrada.`;
          }

          let safra: Safra | undefined;
          if (culturaInput.safrasId?.id) {
            const safraResult = await safraRepository.findOne({ where: { id: culturaInput.safrasId.id } });
            if (!safraResult) {
              throw `Safra de ID ${culturaInput.safrasId.id} não encontrada.`;
            }
            safra = safraResult;
          }

          await pcsRepository.save({
            propriedade,
            cultura,
            safra: safra,
          });
        }
      }

      const propriedadeReturn = await queryRunner.manager.findOne(Propriedade, {
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
      await queryRunner.rollbackTransaction();

      throw new HttpException({ message: 'Não foi possível cadastrar a Propriedade. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    } finally {
      await queryRunner.release();
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
        select: ['id', 'idPublic', 'nome', 'cidade', 'areaTotal', 'areaAgricultavel', 'areaVegetacao', 'ativo', 'produtor', 'culturasSafras'],
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
        select: ['id', 'idPublic', 'nome', 'cidade', 'areaTotal', 'areaAgricultavel', 'areaVegetacao', 'ativo', 'produtor', 'culturasSafras'],
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
      const somaAreas = (body.areaAgricultavel ?? 0) + (body.areaVegetacao ?? 0);
      if (somaAreas > (body.areaTotal ?? 0)) {
        throw new HttpException(
          { message: 'A soma das áreas agricultável e de vegetação não pode ser maior que a área total.' },
          HttpStatus.BAD_REQUEST
        );
      }

      if (body.culturas?.length) {
        const culturaRepository = this.dataSource.getRepository(Cultura);

        await Promise.all(
          body.culturas.map(async (cultura) => {
            const culturaId = cultura.culturaId?.id;
            if (cultura.culturaId) {
              const existente = await culturaRepository.findOne({ where: { id: culturaId } });
              return existente ?? await culturaRepository.save({ id: culturaId });
            }
            return await culturaRepository.save({
              id: cultura.culturaId,
              safras: cultura.safrasId,
            });
          })
        );
      }

      const propriedadeReturne = await this.propriedadeRepository.findOneBy({
        idPublic: idPublic
      })

      if (!propriedadeReturne) {
        throw 'Não foi encontrada Propriedade com esta identificação: ' + idPublic;
      }

      if (body.culturas?.length) {
        const culturaRepository = this.dataSource.getRepository(Cultura);

        await Promise.all(
          body.culturas.map(async (cultura) => {
            const culturaId = cultura.culturaId.id;
            if (cultura.culturaId) {
              const existente = await culturaRepository.findOne({ where: { id: culturaId } });
              return existente ?? await culturaRepository.save({ id: culturaId });
            }
            return await culturaRepository.save({
              id: cultura.culturaId,
              safras: cultura.safrasId,
            });
          })
        );
      }

      const bodyUpdate: Propriedade = { ...propriedadeReturne, ...body };

      const propriedade = await queryRunner.manager.save(Propriedade, bodyUpdate);

      const propriedadeReturn = await queryRunner.manager.findOneBy(Propriedade, { idPublic: idPublic })

      await queryRunner.commitTransaction();

      if (body.culturas?.length) {
        const pcsRepository = this.dataSource.getRepository(PropriedadeCulturaSafra);
        const culturaRepository = this.dataSource.getRepository(Cultura);
        const safraRepository = this.dataSource.getRepository(Safra);

        for (const culturaInput of body.culturas) {
          const cultura = await culturaRepository.findOne({ where: { id: culturaInput.culturaId.id } });
          if (!cultura) {
            throw `Cultura de ID ${culturaInput.culturaId} não encontrada.`;
          }

          let safra: Safra | undefined;
          if (culturaInput.safrasId?.id) {
            const safraResult = await safraRepository.findOne({ where: { id: culturaInput.safrasId.id } });
            if (!safraResult) {
              throw `Safra de ID ${culturaInput.safrasId.id} não encontrada.`;
            }
            safra = safraResult;
          }

          await pcsRepository.save({
            propriedade,
            cultura,
            safra: safra,
          });
        }
      }

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
