import { Module } from '@nestjs/common';
import { CardapioService } from './cardapio.service';
import { CardapioController } from './cardapio.controller';
import { CrmService } from 'src/crm.service';
import { PrismaService } from 'src/config/prisma.client';

@Module({
  controllers: [CardapioController],
  providers: [CardapioService, CrmService, PrismaService],
})
export class CardapioModule {}
