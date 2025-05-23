import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { PrismaService } from 'src/config/prisma.client';
import { CrmService } from 'src/crm.service';

@Module({
  controllers: [PedidoController],
  providers: [PedidoService, PrismaService, CrmService],
})
export class PedidoModule {}
