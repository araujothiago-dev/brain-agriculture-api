import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateProdutoreDto } from '../dto/create-produtor.dto';
import { UpdateProdutoreDto } from '../dto/update-produtor.dto';
import { ProdutoresService } from '../services/produtores.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseGeneric } from 'src/utils/response.generic';
import { Produtor } from '../entities/produtor.entity';
import { PaginationInterface } from 'src/utils/interface/pagination.interface';
import PermissionGuard from 'src/auth/guards/permission.guard';
import ProdutorPermission from '../enum/produtorPermission.enum';
import { FindOneParams } from 'src/utils/findOne.params';

@ApiBearerAuth('access_token')
@ApiTags('produtores')
@ApiResponse({type: ResponseGeneric<Produtor>})
@Controller('produtores')
export class ProdutoresController {
  constructor(private readonly produtoresService: ProdutoresService) {}

  @Post()
  async create(@Body() body: CreateProdutoreDto): Promise<ResponseGeneric<Produtor>> {
    return await this.produtoresService.create(body);
  }

  @Get(':page/:size/search/:parameter')
  @UseGuards(PermissionGuard(ProdutorPermission.LER_PRODUTOR))
  async findAllByParameter(
    @Param('page') page: number, 
    @Param('size') size: number, 
    @Param('parameter') parameter: string = ''
  ): Promise<ResponseGeneric<PaginationInterface<Produtor[]>>> {
    console.log(page, size, parameter);
    
    return await this.produtoresService.findAllByParameter(page, size, parameter);
  }

  @Get(':page/:size')
  @UseGuards(PermissionGuard(ProdutorPermission.LER_PRODUTOR))
  async findAll(
    @Param('page') page: number, 
    @Param('size') size: number, 
  ): Promise<ResponseGeneric<PaginationInterface<Produtor[]>>> {
    console.log(page, size);
    
    return await this.produtoresService.findAll(page, size);
  }

  @Get('propriedade/:idPublicPropriedade')
  @UseGuards(PermissionGuard(ProdutorPermission.LER_PRODUTOR))
  async findAllByPropriedade(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Produtor[]>> {
    return await this.produtoresService.findAllByPropriedade(idPublic);
  }

  @Get(':idPublic')
  @UseGuards(PermissionGuard(ProdutorPermission.LER_PRODUTOR))
  findOne(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Produtor>> {
    return this.produtoresService.findOne(idPublic);
  }

  @Patch(':idPublic')
  @UseGuards(PermissionGuard(ProdutorPermission.MODIFICAR_PRODUTOR))
  update(@Param() {idPublic}: FindOneParams, @Body() body: UpdateProdutoreDto): Promise<ResponseGeneric<Produtor>> {
    return this.produtoresService.update(idPublic, body);
  }

  @Delete(':idPublic')
  @UseGuards(PermissionGuard(ProdutorPermission.MODIFICAR_PRODUTOR_ADMIN))
  remove(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Produtor>> {
    return this.produtoresService.remove(idPublic);
  }
}
