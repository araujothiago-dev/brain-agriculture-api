import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProdutoreDto } from '../dto/create-produtor.dto';
import { UpdateProdutoreDto } from '../dto/update-produtor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Produtor } from '../entities/produtor.entity';
import { ResponseGeneric } from 'src/utils/response.generic';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class ProdutoresService {
  constructor(
    @InjectRepository(Produtor)
    private produtorRepository: Repository<Produtor>,
    private dataSource: DataSource,

  ) { }

  async create(body: CreateProdutoreDto) {
    try {
      if (body.cpfCnpj) {
        body.cpfCnpj = body.cpfCnpj.replace(/[^0-9]/g, "").trim();
      }

      const existingProdutor = await this.produtorRepository.findOne({
        where: { cpfCnpj: body.cpfCnpj },
      });

      if (existingProdutor) {
        throw 'Produtor com o mesmo CPF/CNPJ já cadastrado.';
      }

      const produtor = await this.produtorRepository.save(body);

      const produtorReturn = await this.produtorRepository.findOneBy({ id: produtor.id });

      if (!produtorReturn) {
        throw 'Erro ao buscar o produtor.';
      }

      return new ResponseGeneric<Produtor>(produtorReturn);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível cadastrar Produtor. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(page: number, size: number, parameter?: string) {
    try {
      const [produtores, total]: [Produtor[], number] = await this.produtorRepository.findAndCount({
        loadEagerRelations: false,
        relations: {
          propriedades: true
        },
        select: ['id', 'idPublic', 'nome', 'cpfCnpj', 'ativo', 'propriedades'],
        where: [
          {
            nome: ILike('%' + parameter + '%'),
            ativo: true,
          },
          {
            cpfCnpj: ILike('%' + parameter + '%'),
            ativo: true,
          }
        ],
        order: {
          nome: 'ASC'
        },
        take: size || 10,
        skip: (page - 1) * (size || 10)
      });

      return new ResponseGeneric<PaginationInterface<Produtor[]>>({
        content: produtores,
        total: total,
        totalPages: Math.ceil(total / size)
      });
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível buscar os Produtores. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND);
    }
  }

  async findAllByPropriedade(idPublicPropriedade: string) {
    try {
      const produtor: Produtor[] = await this.produtorRepository.find({
        loadEagerRelations: false,
        relations: {
          propriedades: true
        },
        select: ['id', 'idPublic', 'nome', 'cpfCnpj', 'ativo', 'propriedades'],
        where: {
          propriedades: {
            idPublic: idPublicPropriedade
          },
          ativo: true,
        },
        order: {
          nome: 'ASC'
        }
      });

      return new ResponseGeneric<Produtor[]>(produtor);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível buscar os Produtor pela Propriedade. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND);
    }
  }

  async findOne(idPublic: string) {
    try {
      const produtor = await this.produtorRepository.findOne({
        loadEagerRelations: false,
        relations: {
          propriedades: true
        },
        where: {
          idPublic: idPublic
        }
      });

      if (!produtor) {
        throw 'Não foi encontrado Produtor com esta identificação: ' + idPublic;
      }

      return await new ResponseGeneric<Produtor>(produtor);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível buscar o Produtor. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

  async update(idPublic: string, body: UpdateProdutoreDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const produtorReturne = await this.produtorRepository.findOneBy({
        idPublic: idPublic
      })

      if (!produtorReturne) {
        throw 'Não foi encontrado Produtor com esta identificação: ' + idPublic;
      }

      const bodyUpdate: Produtor = { ...produtorReturne, ...body };

      await queryRunner.manager.save(Produtor, bodyUpdate);

      const produtor = await queryRunner.manager.findOneBy(Produtor, { idPublic: idPublic })

      await queryRunner.commitTransaction();

      return new ResponseGeneric<Produtor>(produtor);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new HttpException({ message: 'Não foi possível modificar o Produtor. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    } finally {
      await queryRunner.release();
    }
  }

  async remove(idPublic: string) {
    try {
      const produtorReturn = await this.produtorRepository.findOne({
        where: {
          idPublic
        },
        select: ['id', 'idPublic', 'cpfCnpj', 'nome'],
      })

      if (!produtorReturn) {
        throw 'Não foi encontrado Produtor com esta identificação: ' + idPublic;
      }

      const returnDelete = await this.produtorRepository.delete({ idPublic: produtorReturn.idPublic }).catch(async err => {
        if (err?.code == '23503') {
          return await this.produtorRepository.softDelete({ idPublic: produtorReturn.idPublic })
        } else {
          throw err;
        }
      });

      return new ResponseGeneric<Produtor>(null, returnDelete.affected + ' Produtor deletado com sucesso.');
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível deletar o Produtor. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }
}
