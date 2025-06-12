import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EstadoService } from '../service/estado.service';
import { CreateEstadoDto } from '../dto/create-estado.dto';
import { UpdateEstadoDto } from '../dto/update-estado.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import PermissionGuard from 'src/auth/guards/permission.guard';
import EstadoPermission from '../enums/estadoPermission.enum';
import { Estado } from '../entities/estado.entity';
import { ResponseGeneric } from 'src/utils/response.generic';
import { FindOneParams } from 'src/utils/findOne.params';

@ApiBearerAuth('access_token')
@ApiTags('estado')
@ApiResponse({type: ResponseGeneric<Estado>})
@Controller('estado')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  @Post()
  @UseGuards(PermissionGuard(EstadoPermission.MODIFICAR_ESTADO))
  create(@Body() createEstadoDto: CreateEstadoDto): Promise<ResponseGeneric<Estado>> {
    return this.estadoService.create(createEstadoDto);
  }

  @Get()
  findAll(): Promise<ResponseGeneric<Estado[]>> {
    return this.estadoService.findAll();
  }

  @Get('sigla/:sigla')
  async findBySigla(@Param('sigla') sigla: string): Promise<ResponseGeneric<Estado>> {
    return await this.estadoService.findBySigla(sigla);
  }

  @Get(':idPublic')
  findOne(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Estado>> {
    return this.estadoService.findOne(idPublic);
  }

  @Get(':idPublic/municipios')
  findOneAndMunicipio(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Estado>> {
    return this.estadoService.findOneAndMunicipios(idPublic);
  }

  @Patch(':idPublic')
  @UseGuards(PermissionGuard(EstadoPermission.MODIFICAR_ESTADO))
  update(@Param() {idPublic}: FindOneParams, @Body() updateEstadoDto: UpdateEstadoDto): Promise<ResponseGeneric<Estado>> {
    return this.estadoService.update(idPublic, updateEstadoDto);
  }

  @Delete(':idPublic')
  @UseGuards(PermissionGuard(EstadoPermission.MODIFICAR_ESTADO))
  remove(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Estado>> {
    return this.estadoService.remove(idPublic);
  }
}
