import { Module } from '@nestjs/common';
import { ComandaService } from './comanda.service';
import { ComandaController } from './comanda.controller';
import { PrismaService } from 'src/config/prisma.client';
import { CrmService } from 'src/crm.service';
import { UserService } from 'src/user/user.service';
import { PedidoService } from 'src/pedido/pedido.service';

@Module({
  controllers: [ComandaController],
  providers: [
    ComandaService,
    PrismaService,
    CrmService,
    UserService,
    PedidoService,
  ],
})
export class ComandaModule {}
