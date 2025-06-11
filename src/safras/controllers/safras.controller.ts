import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SafrasService } from '../services/safras.service';
import { CreateSafraDto } from '../dto/create-safra.dto';
import { UpdateSafraDto } from '../dto/update-safra.dto';

@Controller('safras')
export class SafrasController {
  constructor(private readonly safrasService: SafrasService) {}

  @Post()
  create(@Body() createSafraDto: CreateSafraDto) {
    return this.safrasService.create(createSafraDto);
  }

  @Get()
  findAll() {
    return this.safrasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.safrasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSafraDto: UpdateSafraDto) {
    return this.safrasService.update(id, updateSafraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.safrasService.remove(id);
  }
}
