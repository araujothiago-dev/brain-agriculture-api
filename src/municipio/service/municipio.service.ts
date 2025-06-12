import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseGeneric } from 'src/utils/response.generic';
import { DataSource, ILike, Repository } from 'typeorm';
import { CreateMunicipioDto } from '../dto/create-municipio.dto';
import { UpdateMunicipioDto } from '../dto/update-municipio.dto';
import { Municipio } from '../entities/municipio.entity';

@Injectable()
export class MunicipioService {
  constructor(
    @InjectRepository(Municipio)
    private municipioRepository: Repository<Municipio>,
    private dataSource: DataSource
  ) {}

  async create(createMunicipioDto: CreateMunicipioDto) {
    try {      
      // Salva novo municipio no banco
      const municipio = await this.municipioRepository.save(createMunicipioDto)

      // Retorna dados do municipio cadastrado
      return await new ResponseGeneric<Municipio>(municipio);
    } catch (error) {
      // Verifica se o erro retornado é de dados duplicados na tabela
      if (error.code == 23505) {
        // Define mensagem de erro
        error = 'Já existe um Municipio igual a este cadastrado.'
      }

      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível cadastrar Municipio. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try {
      const municipios: Municipio[] = await this.municipioRepository.find({
        where: {
          estado: {
            sigla: 'MA'
          }
        }
      });
      return await new ResponseGeneric<Municipio[]>(municipios);
    } catch(error) {
      throw new HttpException({ message: 'Não foi possível listar Municipios. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }  
  }

  async findAtivoTrue() {
    try {
      const ativo: boolean = true;
      const municipios: Municipio[] = await this.municipioRepository.findBy({ativo});
      return await new ResponseGeneric<Municipio[]>(municipios);
    } catch(error) {
      throw new HttpException({ message: 'Não foi possível listar Municipios. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }  
  }

  async findNome(nome: string) {
    try {
      const municipio: Municipio[] = await this.municipioRepository.find({
        where: {
          nome: ILike('%'+nome+'%')
        }
      });
      return await new ResponseGeneric<Municipio[]>(municipio);
    } catch(error) {
      throw new HttpException({ message: 'Não foi possível listar Municipios. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }  
  }

  async findNomeAndAtivoTrue(nome: string) {
    try {
      const ativo: boolean = true;
      const municipio: Municipio[] = await this.municipioRepository.find({
        where: {
          nome: ILike('%'+nome+'%'),
          ativo: ativo
        },
      });
      return await new ResponseGeneric<Municipio[]>(municipio);
    } catch(error) {
      throw new HttpException({ message: 'Não foi possível listar Municipios. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }  
  }

  async findOne(idPublic: string) {
    try {
      const municipio = await this.municipioRepository.findOneBy({idPublic});
      if (!municipio) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Municipio com esta identificação: ' + idPublic;
      }
      return await new ResponseGeneric<Municipio>(municipio);
    } catch(error) {
      throw new HttpException({ message: 'Não foi possível buscar o Municipio. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    } 
  }

  // Atualiza dados do municipio com o idPublic
  async update(idPublic: string, body: UpdateMunicipioDto) {
    // Importa executor de consultas
    const queryRunner = this.dataSource.createQueryRunner();

    // Inicia conexão com o banco
    await queryRunner.connect();

    // Inicia Transaction
    await queryRunner.startTransaction();

    try {
      // Busca no banco um município com o idPublic informado
      const municipioCheck = await queryRunner.manager.findOneBy(Municipio, { idPublic })
      
      // Verifica se foi encontrado algum município
      if (!municipioCheck) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Município com esta identificação: ' + idPublic;
      }

      // Atualiza dados do município com o idPublic informado
      await queryRunner.manager.update(Municipio, { idPublic }, body)

      // Busca no banco um município com o idPublic informado
      const municipio = await queryRunner.manager.findOneBy(Municipio, { idPublic })

      // Salva Transaction
      await queryRunner.commitTransaction();

      // Retorna município modificado
      return new ResponseGeneric<Municipio>(municipio);
    } catch (error) {
      // Retorna dados da transaction
      await queryRunner.rollbackTransaction(); 

      // Retornar mensagem de erro
      throw new HttpException({ message: 'Não foi possível modificar o Município. ', code: error?.code, erro: error }, HttpStatus.BAD_GATEWAY)      
    } finally {
      // Libera conexão com o banco
      await queryRunner.release();
    }
  }

  // Deleta municipio por idPublic
  async remove(idPublic: string) {
    try {
      // Busca no banco um municipio com o idPublic informado
      const municipio = await this.municipioRepository.findOneBy({ idPublic }) 

      // Verifica se foi encontrado algum municipio
      if (!municipio) {
        // Retorna mensagem de erro
        throw 'Não foi encontrado Municipio com esta identificação: ' + idPublic;
      }

      // Deleta o municipio com o idPublic informado
      await this.municipioRepository.delete({ idPublic });

      
      // Returna mensagem de sucesso
      return await new ResponseGeneric<Municipio>(null, 'Municipio deletado com sucesso.');
    } catch (error) {
      // Verifica se o erro retornado é de existência de tabelas relacionadas
      if (error && error.code == '23503') {
        // Define mensagem de erro
        error = "Existem registros na tabela '" + error.table + "' que dependem deste Municipio."
      }

      // Retorna mensagem de erro
      throw new HttpException({ message: 'Não foi possível deletar o Municipio. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }
}
