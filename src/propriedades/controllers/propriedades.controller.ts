import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PropriedadesService } from '../services/propriedades.service';
import { CreatePropriedadeDto } from '../dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from '../dto/update-propriedade.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseGeneric } from 'src/utils/response.generic';
import { Propriedade } from '../entities/propriedade.entity';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';
import PermissionGuard from 'src/auth/guards/permission.guard';
import PropriedadesPermission from '../enums/propriedadesPermission.enum';
import { UpdatePropriedadeParceiroDto } from '../dto/update-propriedade-parceiro.dto copy';

@ApiBearerAuth('access_token')
@ApiTags('propriedades')
@ApiResponse({ type: ResponseGeneric<Propriedade> })
@Controller('propriedades')
export class PropriedadesController {
  constructor(private readonly propriedadesService: PropriedadesService) { }

  @Post()
  @UseGuards(PermissionGuard(PropriedadesPermission.MODIFICAR_PROPRIEDADES))
  async create(@Body() body: CreatePropriedadeDto): Promise<ResponseGeneric<Propriedade>> {
    return await this.propriedadesService.create(body);
  }

  @Get(':page/:size/search/:parameter')
  @UseGuards(PermissionGuard(PropriedadesPermission.LER_PROPRIEDADES))
  async findAll(
    @Param('page') page: number,
    @Param('size') size: number,
    @Param('parameter') parameter: string = ''
  ): Promise<ResponseGeneric<PaginationInterface<Propriedade[]>>> {
    return await this.propriedadesService.findAll(page, size, parameter);
  }

  @Get('produtor/:idPublicProdutor')
  @UseGuards(PermissionGuard(PropriedadesPermission.LER_PROPRIEDADES))
  async findAllByProdutor(@Param('idPublicProdutor') idPublicProdutor: string): Promise<ResponseGeneric<Propriedade[]>> {
    return await this.propriedadesService.findAllByProdutor(idPublicProdutor);
  }

  @Get(':idPublic')
  @UseGuards(PermissionGuard(PropriedadesPermission.LER_PROPRIEDADES))
  async findOne(@Param('idPublic') idPublic: string): Promise<ResponseGeneric<Propriedade>> {
    return await this.propriedadesService.findOne(idPublic);
  }

  @Patch('parceiro/:idPublic')
  @UseGuards(PermissionGuard(PropriedadesPermission.MODIFICAR_PROPRIEDADES_ADMIN))
  async updateParceiro(@Param('idPublic') idPublic: string, @Body() body: UpdatePropriedadeParceiroDto): Promise<ResponseGeneric<Propriedade>> {
    return await this.propriedadesService.updateParceiro(idPublic, body);
  }

  @Patch(':idPublic')
  @UseGuards(PermissionGuard(PropriedadesPermission.MODIFICAR_PROPRIEDADES))
  async update(@Param('idPublic') idPublic: string, @Body() body: UpdatePropriedadeDto): Promise<ResponseGeneric<Propriedade>> {
    return await this.propriedadesService.update(idPublic, body);
  }

  @Delete(':idPublic')
  @UseGuards(PermissionGuard(PropriedadesPermission.MODIFICAR_PROPRIEDADES_ADMIN))
  async remove(@Param('idPublic') idPublic: string): Promise<ResponseGeneric<Propriedade>> {
    return await this.propriedadesService.remove(idPublic);
  }

}
