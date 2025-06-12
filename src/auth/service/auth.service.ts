import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './../../usuario/entities/usuario.entity';

import { LoginUsuarioDto } from './../../usuario/dto/login-usuario.dto';
import { IdDto } from 'src/utils/id.dto';

@Injectable()
export class AuthService {
	constructor(
    private jwtService: JwtService,
    private dataSource: DataSource
	) {}

	async validateUser(email: string, senha: string): Promise<any> {
		const usuario = await this.dataSource.getRepository(Usuario).findOne({
			where: {
				email
			},
			select: ['id', 'idPublic', 'nome', 'email', 'cpfCnpj', 'senha', 'ativo', 'firstAccess', 'lastAccess', 'perfil', 'createdAt', 'updatedAt'],
			relations: {
				perfil: {
					permission: true
				},
			},
			loadEagerRelations: false
		});
    
		if (!usuario) {
			throw new UnauthorizedException('Usuário e/ou senha incorretos.');
		}

		if (!usuario.ativo) {
			throw new UnauthorizedException('Seu usuário está inativo.');
		}

		const body = {
			firstAccess: usuario.firstAccess || new Date(new Date().setHours(new Date().getHours() - 3)),
			lastAccess: new Date(new Date().setHours(new Date().getHours() - 3)),
			updatedAt: usuario.updatedAt
		}

		const usuarioReturn = await bcrypt.compare(senha, usuario.senha).then(async (result) => {
				if (result) {				
					await this.dataSource.getRepository(Usuario).update({ id: usuario.id }, body)

					const user = await this.dataSource.getRepository(Usuario).findOne({
						loadEagerRelations: false,
						select: ['id', 'idPublic', 'nome', 'email', 'cpfCnpj', 'ativo', 'firstAccess', 'lastAccess', 'perfil', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'dataDelete'],
						where: {
							id: usuario.id
						},
						relations: {
							perfil: {
								permission: true
							},
						}
					});

					return user;
				}
				
			throw new UnauthorizedException('Usuário e/ou senha incorretos.');
		});
		
		return usuarioReturn;
	}
  
	async login(usuario: LoginUsuarioDto) {
		const usuarioReturn = await this.dataSource.getRepository(Usuario).findOne({
			loadEagerRelations: false,
			where: {
				email: usuario.email
			},
			relations: {
				perfil: {
					permission: true
				},
			}
		});

		if (!usuarioReturn) {
			throw new UnauthorizedException('Usuário e/ou senha incorretos.');
		}

		const payload = { userId: usuarioReturn.id, email: usuario.email };
		
		const token = this.jwtService.sign(payload);
		
		return {
			access_token: token,
			usuario: usuarioReturn
		};
  }

	async loginToken(userToken: IdDto) {
		const usuarioReturn = await this.dataSource.getRepository(Usuario).findOne({
			loadEagerRelations: false,
			select: ['id', 'idPublic', 'nome', 'email', 'cpfCnpj', 'ativo', 'firstAccess', 'lastAccess', 'perfil', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'dataDelete'],
			where: {
				id: userToken.id
			},
			relations: {
				perfil: {
					permission: true
				},
			}
		});

		if (!usuarioReturn) {
			throw new UnauthorizedException('Usuário não encontrado.');
		}

		const payload = { userId: usuarioReturn.id, email: usuarioReturn.email };
		
		const token = this.jwtService.sign(payload);
		
		return {
			access_token: token,
			usuario: usuarioReturn
		};
	}
}