import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import PermissionGuard from 'src/auth/guards/permission.guard';
import { FindOneParams } from 'src/utils/findOne.params';
import { IdDto } from 'src/utils/id.dto';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';
import { ResponseGeneric } from 'src/utils/response.generic';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { Usuario } from '../entities/usuario.entity';
import UsuarioPermission from '../enums/usuarioPermission.enum';
import { UsuarioService } from '../service/usuario.service';

@ApiBearerAuth('access_token')
@ApiTags('Usuário')
@ApiResponse({type: ResponseGeneric<Usuario>})
@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post()
  @UseGuards(PermissionGuard(UsuarioPermission.MODIFICAR_USUARIO, false))
  async create(@Body() body: CreateUsuarioDto): Promise<ResponseGeneric<Usuario>> {
    return await this.usuarioService.create(body);
  }

  @Get('admin/:page/:size/search/:parameter')
  @UseGuards(PermissionGuard(UsuarioPermission.LER_USUARIO, false))
  async findAllAdmin(@Param('page') page: number, @Param('size') size: number, @Param('parameter') parameter: string = ''): Promise<ResponseGeneric<PaginationInterface<Usuario[]>>> {
    return await this.usuarioService.findAllAdmin(parameter, page, size);
  }

  @Get('parceiro/tipo/:page/:size/search/:parameter')
  @UseGuards(PermissionGuard(UsuarioPermission.LER_USUARIO, false))
  async findAllParceiro(@Param('page') page: number, @Param('size') size: number, @Param('parameter') parameter: string = '', @Query('idPublic') idPublic: string = ''): Promise<ResponseGeneric<PaginationInterface<Usuario[]>>> {
    return await this.usuarioService.findAllParceiro(parameter, idPublic, page, size);
  }

  @Get('cliente/:page/:size/search/:parameter')
  @UseGuards(PermissionGuard(UsuarioPermission.LER_USUARIO_CLIENTE, false))
  async findAllCliente(@Param('page') page: number, @Param('size') size: number, @Param('parameter') parameter: string = ''): Promise<ResponseGeneric<PaginationInterface<Usuario[]>>> {
    return await this.usuarioService.findAllCliente(parameter, page, size);
  }

  @Get('simples/:idPublicGrupo')
  @UseGuards(PermissionGuard(UsuarioPermission.LER_USUARIO_CLIENTE, false))
  async findAllClienteSimple(@Param('idPublicGrupo') idPublicGrupo: string): Promise<ResponseGeneric<Usuario[]>> {
    return await this.usuarioService.findAllClienteSimple(idPublicGrupo);
  }

  @Get(':idPublic')
  @UseGuards(PermissionGuard(UsuarioPermission.LER_USUARIO, true))
  findOne(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Usuario>> {
    return this.usuarioService.findOne(idPublic);
  }

  @Patch(':idPublic')
  @UseGuards(PermissionGuard(UsuarioPermission.MODIFICAR_USUARIO, false))
  async update(@Param() {idPublic}: FindOneParams, @Body() body: UpdateUsuarioDto): Promise<ResponseGeneric<Usuario>> {
    return await this.usuarioService.update(idPublic, body);
  }

  @Delete(':idPublic')
  @UseGuards(PermissionGuard(UsuarioPermission.MODIFICAR_USUARIO, false))
  remove(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Usuario>> {
    return this.usuarioService.remove(idPublic);
  }

}
