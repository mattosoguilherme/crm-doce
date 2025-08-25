import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ComandaService } from './comanda.service';
import { UpdateComandaDto } from './dto/update-comanda.dto';

@Controller('comanda')
export class ComandaController {
  constructor(private readonly comandaService: ComandaService) {}

  @Post()
  create() {
    return this.comandaService.create();
  }

  @Get()
  findAll() {
    return this.comandaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.comandaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateComandaDto: UpdateComandaDto) {
    return this.comandaService.update(id, updateComandaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comandaService.remove(+id);
  }

  @Delete()
  removeAll() {
    return this.comandaService.removeAll();
  }


  @Delete('status/:status')
  removeAllByStatus(@Param('status') status: string) {
    return this.comandaService.removeAllByStatus(status);
  }
}
