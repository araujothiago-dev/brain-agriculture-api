import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PropriedadesService } from '../services/propriedades.service';
import { CreatePropriedadeDto } from '../dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from '../dto/update-propriedade.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseGeneric } from 'src/utils/response.generic';
import { Propriedade } from '../entities/propriedade.entity';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';

@ApiTags('propriedades')
@ApiResponse({type: ResponseGeneric<Propriedade>})
@Controller('propriedades')
export class PropriedadesController {
  constructor(private readonly propriedadesService: PropriedadesService) {}

  @Post()
    async create(@Body() body: CreatePropriedadeDto): Promise<ResponseGeneric<Propriedade>> {
      return await this.propriedadesService.create(body);
    }
  
    @Get(':page/:size/search/:parameter')
    async findAll(
      @Param('page') page: number, 
      @Param('size') size: number, 
      @Param('parameter') parameter: string = ''
    ): Promise<ResponseGeneric<PaginationInterface<Propriedade[]>>> {
      return await this.propriedadesService.findAll(page, size, parameter);
    }

    @Get('produtor/:idPublicProdutor')
    async findAllByProdutor(@Param('idPublicProdutor') idPublicProdutor: string): Promise<ResponseGeneric<Propriedade[]>> {
      return await this.propriedadesService.findAllByProdutor(idPublicProdutor);
    }

    @Get(':idPublic')
    async findOne(@Param('idPublic') idPublic: string): Promise<ResponseGeneric<Propriedade>> {
      return await this.propriedadesService.findOne(idPublic);
    }
  
    @Patch(':idPublic')
    async update(@Param('idPublic') idPublic: string, @Body() body: UpdatePropriedadeDto): Promise<ResponseGeneric<Propriedade>> {
      return await this.propriedadesService.update(idPublic, body);
    }
  
    @Delete(':idPublic')
    async remove(@Param('idPublic') idPublic: string): Promise<ResponseGeneric<Propriedade>> {
      return await this.propriedadesService.remove(idPublic);
    }
}
