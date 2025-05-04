import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CardapioService } from './cardapio.service';
import { CreateCardapioDto } from './dto/create-cardapio.dto';
import { UpdateCardapioDto } from './dto/update-cardapio.dto';
import { CreateMCardapio } from './dto/createM-cardapio.dto';

@Controller('cardapio')
export class CardapioController {
  constructor(private readonly cardapioService: CardapioService) {}

  @Post()
  async create(@Body() createCardapioDto: CreateMCardapio[]) {
    const cardapio = [];
    //  return await Promise.all( createCardapioDto.map( item =>  this.cardapioService.create(item)) )
    for (const item of createCardapioDto) {
      const createdItem = await this.cardapioService.create(item);

      cardapio.push(createdItem);
    }

    return cardapio;
  }

  @Get()
  findAll() {
    return this.cardapioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cardapioService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCardapioDto: UpdateCardapioDto,
  ) {
    return this.cardapioService.update(id, updateCardapioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cardapioService.remove(id);
  }
}
