import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SafrasService } from '../services/safras.service';
import { CreateSafraDto } from '../dto/create-safra.dto';
import { UpdateSafraDto } from '../dto/update-safra.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseGeneric } from 'src/utils/response.generic';
import { Safra } from '../entities/safra.entity';
import PermissionGuard from 'src/auth/guards/permission.guard';
import SafrasPermission from '../enums/safrasPermission.enum';
import { FindOneParams } from 'src/utils/findOne.params';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';

@ApiBearerAuth('access_token')
@ApiTags('safras')
@ApiResponse({type: ResponseGeneric<Safra>})
@Controller('safras')
export class SafrasController {
  constructor(private readonly safrasService: SafrasService) {}

  @Post()
  @UseGuards(PermissionGuard(SafrasPermission.MODIFICAR_SAFRAS, false))
  async create(@Body() body: CreateSafraDto) {
    return await this.safrasService.create(body);
  }

  @Get(':page/:size/search/:parameter')
  @UseGuards(PermissionGuard(SafrasPermission.LER_SAFRAS, false))
  async findAll(@Param('page') page: number, @Param('size') size: number): Promise<ResponseGeneric<PaginationInterface<Safra[]>>> {
    return await this.safrasService.findAll(page, size);
  }

  @Get(':idPublic')
  @UseGuards(PermissionGuard(SafrasPermission.LER_SAFRAS, false))
  findOne(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Safra>> {
    return this.safrasService.findOne(idPublic);
  }

  @Patch(':idPublic')
  @UseGuards(PermissionGuard(SafrasPermission.MODIFICAR_SAFRAS, false))
  async update(@Param() {idPublic}: FindOneParams, @Body() body: UpdateSafraDto): Promise<ResponseGeneric<Safra>> {
    return await this.safrasService.update(idPublic, body);
  }

  @Delete(':idPublic')
  @UseGuards(PermissionGuard(SafrasPermission.MODIFICAR_SAFRAS_ADMIN, false))
  async remove(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Safra>> {
    return await this.safrasService.remove(idPublic);
  }
}
