import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CulturasService } from '../services/culturas.service';
import { CreateCulturaDto } from '../dto/create-cultura.dto';
import { UpdateCulturaDto } from '../dto/update-cultura.dto';

@Controller('culturas')
export class CulturasController {
  constructor(private readonly culturasService: CulturasService) {}

  @Post()
  create(@Body() createCulturaDto: CreateCulturaDto) {
    return this.culturasService.create(createCulturaDto);
  }

  @Get()
  findAll() {
    return this.culturasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.culturasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCulturaDto: UpdateCulturaDto) {
    return this.culturasService.update(id, updateCulturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.culturasService.remove(id);
  }
}
