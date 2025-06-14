import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Perfil } from 'src/perfil/entities/perfil.entity';
import PerfilEnum from 'src/perfil/enums/perfil.enum';
import { IdDto } from 'src/utils/id.dto';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';
import { PassVerify } from 'src/utils/pass-verify/passVerify';
import { ResponseGeneric } from 'src/utils/response.generic';
import { DataSource, ILike, Repository } from 'typeorm';
import { CpfCnpjVerify } from '../../utils/cpf-cnpj-verify/cpf-cnpj-verify';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { Usuario } from '../entities/usuario.entity';
import { UpdatePassDto } from './../dto/update-pass.dto';
require('dotenv').config();

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private dataSource: DataSource,
    private passVerify: PassVerify,
    private cpfCnpjVerify: CpfCnpjVerify,
  ) { }

  async create(body: CreateUsuarioDto) {
    try {

      if (!(await this.cpfCnpjVerify.cpfCnpjVerify(body.cpfCnpj))) {
        throw 'CPF/CNPJ inválido.';
      }

      const usuarioCheck = await this.usuarioRepository.findOne({
        loadEagerRelations: false,
        where: [
          { cpfCnpj: body.cpfCnpj.trim() },
          { email: body.email.trim().toLowerCase() }
        ],
        select: ['id', 'idPublic', 'email'],
      });

      if (usuarioCheck?.cpfCnpj == body.cpfCnpj.replace(/[^0-9]/g, "").trim()) {
        throw 'Usuário já cadastrado com o mesmo CPF/CNPJ.';
      }

      if (usuarioCheck?.email.trim().toLowerCase() == body.email.trim().toLowerCase()) {
        throw 'Usuário já cadastrado com o mesmo e-mail.';
      }

      if (!(await this.passVerify.passVerify(body.senha))) {
        throw 'Senha deve ter no mínimo 8 caracteres e conter ao menos 1 número, 1 letra minúscula, 1 letra maiúscula e 1 caractere especial. '
      }


      body.senha = await bcrypt.hash(body.senha, Number(process.env.BCRYPT_SALT_ROUNDS));

      body.email = body.email.trim().toLowerCase();

      body.cpfCnpj = body.cpfCnpj.replace(/[^0-9]/g, "").trim();

      const perfil = await this.dataSource.getRepository(Perfil).findOneBy({ id: body.perfil.id });

      if (perfil == null) {
        throw 'Nenhum perfil encontrado.';
      }

      const usuario = await this.usuarioRepository.save(body);

      const usuarioReturn = await this.usuarioRepository.findOneBy({ id: usuario.id });

      if (!usuarioReturn) {
        throw 'Erro ao buscar usuário.';
      }

      return new ResponseGeneric<Usuario>(usuarioReturn);
    } catch (error) {
      console.error(error);
      throw new HttpException({ message: 'Não foi possível cadastrar Usuário. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    }
  }

  async findAllAdmin(parameter: string, page: number, size: number) {
    try {
      parameter = '%' + parameter + '%'

      const [usuarios, total]: [Usuario[], number] = await this.usuarioRepository.findAndCount({
        loadEagerRelations: false,
        relations: {
          produtor: {
            propriedades: true
          },
          perfil: {
            permission: true
          }
        },
        where: [
          {
            cpfCnpj: ILike(parameter),
            perfil: {
              nome: PerfilEnum.ADMIN
            }
          },
          {
            nome: ILike(parameter),
            perfil: {
              nome: PerfilEnum.ADMIN
            }
          },
          {
            email: ILike(parameter),
            perfil: {
              nome: PerfilEnum.ADMIN
            }
          }
        ],
        order: {
          nome: 'ASC'
        },
        take: size,
        skip: size * page
      })

      return new ResponseGeneric<PaginationInterface<Usuario[]>>({
        content: usuarios,
        total: total,
        totalPages: Math.ceil(total / size)
      });
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível listar Usuários.', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

  async findAllGestor(parameter: string, idPublic: string, page: number, size: number) {
    try {
      parameter = '%' + parameter + '%'

      const whereUsed: any[] = [
        {
          cpfCnpj: ILike(parameter),
          perfil: {
            nome: PerfilEnum.PARCEIRO
          }
        },
        {
          nome: ILike(parameter),
          perfil: {
            nome: PerfilEnum.PARCEIRO
          }
        }
      ].map((conditions) => {
        const r: any = { ...conditions };
        if (idPublic != '') r.tipoGestor = { idPublic: idPublic };
        return r;
      });

      const [usuarios, total]: [Usuario[], number] = await this.usuarioRepository.findAndCount({
        loadEagerRelations: false,
        relations: {
          produtor: {
            propriedades: true
          },
          perfil: {
            permission: true
          }
        },
        where: whereUsed,
        order: {
          nome: 'ASC'
        },
        take: size,
        skip: size * page
      })

      return new ResponseGeneric<PaginationInterface<Usuario[]>>({
        content: usuarios,
        total: total,
        totalPages: Math.ceil(total / size)
      });
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível listar Usuários.', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

  async findAllRevisor(parameter: string, page: number, size: number) {
    try {
      parameter = '%' + parameter + '%'

      const [usuarios, total]: [Usuario[], number] = await this.usuarioRepository.findAndCount({
        loadEagerRelations: false,
        relations: {
          produtor: {
            propriedades: true
          },
          perfil: {
            permission: true
          }
        },
        where: [
          {
            cpfCnpj: ILike(parameter),
            perfil: {
              nome: PerfilEnum.CLIENTE
            }
          },
          {
            nome: ILike(parameter),
            perfil: {
              nome: PerfilEnum.CLIENTE
            }
          },
          {
            email: ILike(parameter),
            perfil: {
              nome: PerfilEnum.CLIENTE
            }
          }
        ],
        order: {
          nome: 'ASC'
        },
        take: size,
        skip: size * page
      })

      return new ResponseGeneric<PaginationInterface<Usuario[]>>({
        content: usuarios,
        total: total,
        totalPages: Math.ceil(total / size)
      });
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível listar Usuários.', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

  async findAllRevisorSimple(idPublicGrupo: string) {
    try {
      const usuario: Usuario[] = await this.usuarioRepository.find({
        loadEagerRelations: false,
        relations: {
          produtor: {
            propriedades: true
          }
        },
        select: ['id', 'idPublic', 'nome', 'email', 'ativo'],
        where: {
          produtor: {
            idPublic: idPublicGrupo
          },
          ativo: true
        },
        order: {
          nome: 'ASC'
        }
      })

      return new ResponseGeneric<Usuario[]>(usuario);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível listar Usuários.', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

  async findOne(idPublic: string) {
    try {
      const usuario = await this.usuarioRepository.findOne({
        loadEagerRelations: false,
        relations: {
          perfil: true,
          produtor: {
            propriedades: true
          }
        },
        where: {
          idPublic
        }
      });

      if (!usuario) {
        throw 'Não foi encontrado Usuário com esta identificação: ' + idPublic;
      }

      return await new ResponseGeneric<Usuario>(usuario);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível buscar o Usuário. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

  async update(idPublic: string, body: UpdateUsuarioDto, userToken: IdDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const usuarioCheck = await this.usuarioRepository.findOne({
        loadEagerRelations: false,
        select: ['id', 'idPublic'],
        relations: {
          perfil: true
        },
        where: {
          idPublic
        }
      });

      if (!usuarioCheck) {
        throw 'Não foi encontrado Usuário com esta identificação: ' + idPublic;
      }

      if (usuarioCheck.id == userToken.id) {
        throw 'Usuário sem autorização para modificar o próprio usuário.';
      }

      const bodyUpdate: Usuario = { ...usuarioCheck, ...body };

      await queryRunner.manager.save(Usuario, bodyUpdate)

      const usuario = await queryRunner.manager.findOneBy(Usuario, { idPublic });

      await queryRunner.commitTransaction();

      return new ResponseGeneric<Usuario>(usuario);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new HttpException({ message: 'Não foi possível modificar o Usuário. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    } finally {
      await queryRunner.release();
    }
  }

  async updateRevisor(idPublic: string, body: UpdateUsuarioDto, userToken: IdDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const usuarioCheck = await this.usuarioRepository.findOne({
        loadEagerRelations: false,
        select: ['id', 'idPublic'],
        relations: {
          perfil: true
        },
        where: {
          idPublic,
          perfil: {
            nome: PerfilEnum.CLIENTE
          }
        }
      });

      if (!usuarioCheck) {
        throw 'Não foi encontrado Usuário com esta identificação: ' + idPublic;
      }

      if (usuarioCheck.id == userToken.id) {
        throw 'Usuário sem autorização para modificar o próprio usuário.';
      }

      const bodyUpdate: Usuario = { ...usuarioCheck, ...body };

      await queryRunner.manager.save(Usuario, bodyUpdate)

      const usuario = await queryRunner.manager.findOneBy(Usuario, { idPublic });

      await queryRunner.commitTransaction();

      return new ResponseGeneric<Usuario>(usuario);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new HttpException({ message: 'Não foi possível modificar o Usuário. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    } finally {
      await queryRunner.release();
    }
  }

  async updatePass(idPublic: string, body: UpdatePassDto, userToken: IdDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const usuario = await this.usuarioRepository.findOne({
        loadEagerRelations: false,
        where: { idPublic },
        select: ['id', 'senha', 'email']
      });

      if (!usuario) {
        throw 'Não foi encontrado Usuário com esta identificação: ' + idPublic;
      }

      if (usuario.id != userToken.id) {
        throw 'Usuário sem autorização para modificar outros usuários.';
      }

      const compare = await bcrypt.compare(body.senha, usuario.senha);

      if (!compare) {
        throw "Senha informada incorreta."
      }

      if (!(await this.passVerify.passVerify(body.novaSenha))) {
        throw 'Senha deve ter no mínimo 8 caracteres e conter ao menos 1 número, 1 letra minúscula, 1 letra maiúscula e 1 caractere especial. '
      }

      const hash = await bcrypt.hash(body.novaSenha, Number(process.env.BCRYPT_SALT_ROUNDS));

      await queryRunner.manager.update(Usuario, { idPublic }, { senha: hash })

      await queryRunner.commitTransaction();

      return await new ResponseGeneric<Usuario>(usuario);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new HttpException({ message: 'Não foi possível modificar a senha do Usuário. ', code: error?.code, erro: error }, HttpStatus.BAD_REQUEST)
    } finally {
      await queryRunner.release();
    };
  }

  async remove(idPublic: string, userToken: IdDto) {
    try {
      const usuarioReturn = await this.usuarioRepository.findOne({
        loadEagerRelations: false,
        where: {
          idPublic
        },
        select: ['id', 'idPublic', 'email', 'ativo'],
        relations: {
          perfil: true
        }
      })

      if (!usuarioReturn) {
        throw 'Não foi encontrado Usuário com esta identificação: ' + idPublic;
      }

      if (usuarioReturn.id == userToken.id) {
        throw 'Usuário sem autorização para excluir o próprio usuário.';
      }

      const email = (process.env.ADMIN_USERNAME);
      if (usuarioReturn.email == email) {
        throw 'Usuário Admin não pode ser excluído.';
      }

      const returnDelete = await this.usuarioRepository.delete({ idPublic: usuarioReturn.idPublic }).catch(async err => {
        if (err?.code == '23503') {
          return await this.usuarioRepository.softDelete({ idPublic: usuarioReturn.idPublic })
        }
      });

      const affected = returnDelete && typeof returnDelete.affected === 'number' ? returnDelete.affected : 0;
      return new ResponseGeneric<Usuario>(null, affected + ' Usuário deletado com sucesso.');
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível deletar o Usuário. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND)
    }
  }

}
