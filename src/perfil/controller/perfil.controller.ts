import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PerfilService } from '../service/perfil.service';
import { CreatePerfilDto } from '../dto/create-perfil.dto';
import { UpdatePerfilDto } from '../dto/update-perfil.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import PermissionGuard from 'src/auth/guards/permission.guard';
import PerfilPermission from '../enums/perfilPermission.enum';
import { ResponseGeneric } from 'src/utils/response.generic';
import { Perfil } from '../entities/perfil.entity';
import { FindOneParams } from 'src/utils/findOne.params';

@ApiBearerAuth('access_token')
@ApiTags('Perfil')
@ApiResponse({type: ResponseGeneric<Perfil>})
@Controller('perfil')
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Post()
  @UseGuards(PermissionGuard(PerfilPermission.MODIFICAR_PERFIL))
  async create(@Body() body: CreatePerfilDto): Promise<ResponseGeneric<Perfil>> {
    return await this.perfilService.create(body);
  }
  
  @Get()
  @UseGuards(PermissionGuard(PerfilPermission.LER_PERFIL))
  async findAll(): Promise<ResponseGeneric<Perfil[]>> {
    return await this.perfilService.findAll();
  }

  @Get(':idPublic')
  @UseGuards(PermissionGuard(PerfilPermission.LER_PERFIL))
  async findOne(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Perfil>> {
    return await this.perfilService.findOne(idPublic);
  }

  @Patch(':idPublic')
  @UseGuards(PermissionGuard(PerfilPermission.MODIFICAR_PERFIL))
  update(@Param() {idPublic}: FindOneParams, @Body() body: UpdatePerfilDto): Promise<ResponseGeneric<Perfil>> {
    return this.perfilService.update(idPublic, body);
  }
  
  @Delete(':idPublic')
  @UseGuards(PermissionGuard(PerfilPermission.MODIFICAR_PERFIL))
  remove(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Perfil>> {
    return this.perfilService.remove(idPublic);
  }
}
