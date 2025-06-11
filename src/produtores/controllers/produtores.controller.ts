import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateProdutoreDto } from '../dto/create-produtor.dto';
import { UpdateProdutoreDto } from '../dto/update-produtor.dto';
import { ProdutoresService } from '../services/produtores.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseGeneric } from 'src/utils/response.generic';
import { Produtor } from '../entities/produtor.entity';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';

@ApiTags('produtores')
@ApiResponse({type: ResponseGeneric<Produtor>})
@Controller('produtores')
export class ProdutoresController {
  constructor(private readonly produtoresService: ProdutoresService) {}

  @Post()
  async create(@Body() createProdutoreDto: CreateProdutoreDto): Promise<ResponseGeneric<Produtor>> {
    return await this.produtoresService.create(createProdutoreDto);
  }

  @Get(':page/:size/search/:parameter')
  async findAll(
    @Param('page') page: number, 
    @Param('size') size: number, 
    @Param('parameter') parameter: string = ''
  ): Promise<ResponseGeneric<PaginationInterface<Produtor[]>>> {
    return await this.produtoresService.findAll(page, size, parameter);
  }

  @Get('propriedade/:idPublicPropriedade')
  async findAllByPropriedade(@Param('idPublicPropriedade') idPublicPropriedade: string): Promise<ResponseGeneric<Produtor[]>> {
    return await this.produtoresService.findAllByPropriedade(idPublicPropriedade);
  }

  @Get(':idPublic')
  findOne(@Param('idPublic') idPublic: string): Promise<ResponseGeneric<Produtor>> {
    return this.produtoresService.findOne(idPublic);
  }

  @Patch(':idPublic')
  update(@Param('idPublic') idPublic: string, @Body() updateProdutoreDto: UpdateProdutoreDto): Promise<ResponseGeneric<Produtor>> {
    return this.produtoresService.update(idPublic, updateProdutoreDto);
  }

  @Delete(':idPublic')
  remove(@Param('idPublic') idPublic: string): Promise<ResponseGeneric<Produtor>> {
    return this.produtoresService.remove(idPublic);
  }
}
