import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelatorioService } from './relatorio.service';
import { CreateRelatorioDto } from './dto/create-relatorio.dto';
import { UpdateRelatorioDto } from './dto/update-relatorio.dto';

@Controller('relatorio')
export class RelatorioController {
  constructor(private readonly relatorioService: RelatorioService) {}

  @Post()
  create(@Body() createRelatorioDto: CreateRelatorioDto) {
    return this.relatorioService.create(createRelatorioDto);
  }

  @Get()
  findAll() {
    return this.relatorioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relatorioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRelatorioDto: UpdateRelatorioDto) {
    return this.relatorioService.update(+id, updateRelatorioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relatorioService.remove(+id);
  }
}
