import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CulturasService } from '../services/culturas.service';
import { CreateCulturaDto } from '../dto/create-cultura.dto';
import { UpdateCulturaDto } from '../dto/update-cultura.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cultura } from '../entities/cultura.entity';
import { ResponseGeneric } from 'src/utils/response.generic';
import PermissionGuard from 'src/auth/guards/permission.guard';
import CulturasPermission from '../enums/culturasPermission.enum';
import { FindOneParams } from 'src/utils/findOne.params';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';

@ApiBearerAuth('access_token')
@ApiTags('Culturas')
@ApiResponse({type: ResponseGeneric<Cultura>})
@Controller('culturas')
export class CulturasController {
  constructor(private readonly culturasService: CulturasService) { }

  @Post()
  @UseGuards(PermissionGuard(CulturasPermission.MODIFICAR_CULTURAS, false))
  async create(@Body() createCulturaDto: CreateCulturaDto) {
    return await this.culturasService.create(createCulturaDto);
  }

  @Get(':page/:size/search/:parameter')
  @UseGuards(PermissionGuard(CulturasPermission.LER_CULTURAS, false))
  async findAll(@Param('page') page: number, @Param('size') size: number): Promise<ResponseGeneric<PaginationInterface<Cultura[]>>> {
    return await this.culturasService.findAll(page, size);
  }

  @Get(':idPublic')
  @UseGuards(PermissionGuard(CulturasPermission.LER_CULTURAS, false))
  findOne(@Param('idPublic') {idPublic}: FindOneParams): Promise<ResponseGeneric<Cultura>> {
    return this.culturasService.findOne(idPublic);
  }

  @Patch(':idPublic')
  @UseGuards(PermissionGuard(CulturasPermission.MODIFICAR_CULTURAS, false))
  async update(@Param('idPublic') {idPublic}: FindOneParams, @Body() updateCulturaDto: UpdateCulturaDto) {
    return await this.culturasService.update(idPublic, updateCulturaDto);
  }

  @Delete(':idPublic')
  @UseGuards(PermissionGuard(CulturasPermission.MODIFICAR_CULTURAS, false))
  async remove(@Param('idPublic') {idPublic}: FindOneParams) {
    return await this.culturasService.remove(idPublic);
  }
}
