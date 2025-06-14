import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../service/auth.service';

import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
			usernameField: 'email',
			passwordField: 'senha'
    });
  }

	async validate(email: string, senha: string): Promise<Usuario> {
    const usuario: Usuario = await this.authService.validateUser(email, senha);
      
    return usuario;
  }
}