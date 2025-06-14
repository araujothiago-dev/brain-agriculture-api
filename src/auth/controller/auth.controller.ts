import { JwtAuthGuard } from './../guards/jwt-auth.guard';
import { Controller, Post, UseGuards, Body, Get, Request, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from '../guards/local-auth.guard';

import { AuthService } from '../service/auth.service';

import { LoginUsuarioDto } from './../../usuario/dto/login-usuario.dto';
import PermissionGuard from '../guards/permission.guard';
import UsuarioPermission from 'src/usuario/enums/usuarioPermission.enum';
import { IdDto } from 'src/utils/id.dto';

@ApiTags('Token')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }
    
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: LoginUsuarioDto) {
    return await this.authService.login(body);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(PermissionGuard(UsuarioPermission.MODIFICAR_USUARIO_PUBLIC, true))
  @Post('user')
  async user(@Body('userToken') userToken: IdDto) {    
    if (!userToken) {
      throw new UnauthorizedException('Login necessário.');
    }
    return await this.authService.loginToken(userToken);
  }
}
