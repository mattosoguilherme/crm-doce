import { Injectable } from '@nestjs/common';
import { CreateCardapioDto } from './dto/create-cardapio.dto';
import { UpdateCardapioDto } from './dto/update-cardapio.dto';
import { PrismaService } from 'src/config/prisma.client';
import { CrmService } from 'src/crm.service';
import { Cardapio } from '@prisma/client';

@Injectable()
export class CardapioService {
  constructor(
    private prisma: PrismaService,
    private crmService: CrmService,
  ) {}

  async create(createCardapioDto: CreateCardapioDto): Promise<Cardapio> {
    return await this.prisma.cardapio.create({
      data: {
        descricao: createCardapioDto.descricao,
        preco: createCardapioDto.preco,
        titulo: this.crmService.titleize(createCardapioDto.titulo),
        urlFoto: createCardapioDto.urlFoto,
      },
    });
  }

  async findAll(): Promise<Cardapio[]> {
    return await this.prisma.cardapio.findMany();
  }

  async findOne(id: number): Promise<Cardapio> {
    return await this.prisma.cardapio.findUnique({ where: { id: id } });
  }

  async update(id: number, updateCardapioDto: UpdateCardapioDto) {
    return await this.prisma.cardapio.update({
      where: { id: id },
      data: {
        descricao: updateCardapioDto.descricao,
        preco: updateCardapioDto.preco,
        titulo: this.crmService.titleize(updateCardapioDto.titulo),
        urlFoto: updateCardapioDto.urlFoto,
      },
    });
  }

  async remove(id: number): Promise<Cardapio> {
    return await this.prisma.cardapio.delete({ where: { id: id } });
  }

  
}
