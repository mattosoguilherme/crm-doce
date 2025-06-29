import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { PrismaService } from 'src/config/prisma.client';
import { ComandaService } from 'src/comanda/comanda.service';
import { CrmService } from 'src/crm.service';
import { UserService } from 'src/user/user.service';
import { PedidoService } from 'src/pedido/pedido.service';

@Module({
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
    PrismaService,
    ComandaService,
    CrmService,
    UserService,
    PedidoService,
  ],
})
export class WhatsappModule {}
