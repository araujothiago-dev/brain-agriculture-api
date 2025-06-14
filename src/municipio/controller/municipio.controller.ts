import { Municipio } from 'src/municipio/entities/municipio.entity';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MunicipioService } from '../service/municipio.service';
import { CreateMunicipioDto } from '../dto/create-municipio.dto';
import { UpdateMunicipioDto } from '../dto/update-municipio.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import PermissionGuard from 'src/auth/guards/permission.guard';
import MunicipioPermission from '../enums/municipioPermission.enum';
import { ResponseGeneric } from 'src/utils/response.generic';
import { FindOneParams } from 'src/utils/findOne.params';

@ApiBearerAuth('access_token')
@ApiTags('municipio')
@ApiResponse({type: ResponseGeneric<Municipio>})
@Controller('municipio')
export class MunicipioController {
  constructor(private readonly municipioService: MunicipioService) {}

  @Post()
  @UseGuards(PermissionGuard(MunicipioPermission.MODIFICAR_MUNICIPIO))
  create(@Body() createMunicipioDto: CreateMunicipioDto): Promise<ResponseGeneric<Municipio>> {
    return this.municipioService.create(createMunicipioDto);
  }

  @Get()
  findAll(): Promise<ResponseGeneric<Municipio[]>> {
    return this.municipioService.findAll();
  }

  @Get('ativo')
  findAtivo(): Promise<ResponseGeneric<Municipio[]>> {
    return this.municipioService.findAtivoTrue();
  }

  @Get(':idPublic')
  findOne(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Municipio>> {
    return this.municipioService.findOne(idPublic);
  }

  @Get('nome/:nome')
  findNome(@Param('nome') nome: string): Promise<ResponseGeneric<Municipio[]>> {
    return this.municipioService.findNome(nome);
  }

  @Get('ativo/nome/:nome')
  findNomeAndAtivo(@Param('nome') nome: string): Promise<ResponseGeneric<Municipio[]>> {
    return this.municipioService.findNomeAndAtivoTrue(nome);
  }

  @Patch(':idPublic')
  @UseGuards(PermissionGuard(MunicipioPermission.MODIFICAR_MUNICIPIO))
  update(@Param() {idPublic}: FindOneParams, @Body() updateMunicipioDto: UpdateMunicipioDto): Promise<ResponseGeneric<Municipio>> {
    return this.municipioService.update(idPublic, updateMunicipioDto);
  }

  @UseGuards(PermissionGuard(MunicipioPermission.MODIFICAR_MUNICIPIO))
  @Delete(':idPublic')
  remove(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Municipio>> {
    return this.municipioService.remove(idPublic);
  }
}
