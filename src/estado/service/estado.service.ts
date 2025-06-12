import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateEstadoDto } from '../dto/create-estado.dto';
import { UpdateEstadoDto } from '../dto/update-estado.dto';
import { Estado } from '../entities/estado.entity';
import { ResponseGeneric } from 'src/utils/response.generic';

@Injectable()
export class EstadoService {
  constructor(
    @InjectRepository(Estado)
    private estadoRepository: Repository<Estado>,
    private dataSource: DataSource
  ) {}

  async create(createEstadoDto: CreateEstadoDto) {
    try {      
      // Salva novo estado no banco
      const estado = await this.estadoRepository.save(createEstadoDto)

      // Retorna dados do estado cadastrado
      return new ResponseGeneric<Estado>(estado);
    } catch (error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível cadastrar Estado. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    }
  }

  // Listagem de todos os estados
  async findAll() {
    try {
      // Busca todos os estados cadastrados ordenando pelo nome
      const estados = await this.estadoRepository.find({
        order: {
          nome: 'ASC'
        }
      });

      // Retorna lista de estados
      return new ResponseGeneric<Estado[]>(estados);
    } catch(error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível listar Estados. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }  
  }

  async findOne(idPublic: string) {
    try {
      // Busca no banco um estado com o idPublic informado
      const estado = await this.estadoRepository.findOneBy({ idPublic });
      
      // Verifica se foi encontrado algum estado
      if (!estado) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Estado com esta identificação: ' + idPublic;
      }
      
      // Retorna estado encontrado
      return await new ResponseGeneric<Estado>(estado);
    } catch(error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível buscar o Estado. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    } 
  }

  async findBySigla(sigla: string) {
    try {
      const estado = await this.estadoRepository.findOne({ 
        where: { sigla },
        relations: {
          municipio: true
        }
       });
      
      if (!estado) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Estado com esta sigla: ' + sigla;
      }

      return await new ResponseGeneric<Estado>(estado);
    } catch(error) {
      throw new HttpException({ message: 'Não foi possível buscar o Estado. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    } 
  }

  // Lista todos os municipios de um determinado estado.
  async findOneAndMunicipios(idPublic: string) {
    try {
      const estado = await this.estadoRepository.findOne({
        where: {idPublic},
        relations: {
          municipio: true
        }
      });
      if (!estado) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Estado com esta identificação: ' + idPublic;
      }
      return await new ResponseGeneric<Estado>(estado);
    } catch(error) {
      throw new HttpException({ message: 'Não foi possível buscar o Estado. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    } 
  }

  // Atualiza dados do estado com o idPublic
  async update(idPublic: string, body: UpdateEstadoDto) {
    // Importa executor de consultas
    const queryRunner = this.dataSource.createQueryRunner();

    // Inicia conexão com o banco
    await queryRunner.connect();

    // Inicia Transaction
    await queryRunner.startTransaction();

    try {
      // Busca no banco um estado com o idPublic informado
      const estadoCheck = await this.estadoRepository.findOneBy({ idPublic })
      
      // Verifica se foi encontrado algum estado
      if (!estadoCheck) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Estado com esta identificação: ' + idPublic;
      }
  
      // Atualiza dados do estado com o idPublic informado
      await queryRunner.manager.update(Estado, { idPublic }, body)

      // Busca no banco um estado com o idPublic informado
      const estado = await queryRunner.manager.findOneBy(Estado, { idPublic })

      // Salva Transaction
      await queryRunner.commitTransaction();

      // Retorna estado modificado
      return new ResponseGeneric<Estado>(estado);
    } catch (error) {
      // Retorna dados da transaction
      await queryRunner.rollbackTransaction();

      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível modificar o Estado. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)       
    } finally {
      // Libera conexão com o banco
      await queryRunner.release();
    }
  }

  // Deleta estado por idPublic
  async remove(idPublic: string) {
    try {
      // Busca no banco um estado com o idPublic informado
      const estado = await this.estadoRepository.findOneBy({ idPublic }) 

      // Verifica se foi encontrado algum estado
      if (!estado) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Estado com esta identificação: ' + idPublic;
      }

      // Deleta o estado com o idPublic informado
      const returnDelete = await this.estadoRepository.delete({ idPublic });
      
      // Returna mensagem de sucesso
      return new ResponseGeneric<Estado>(null, returnDelete.affected + ' Estado deletado com sucesso.');
    } catch (error) {
      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível deletar o Estado. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }
}
