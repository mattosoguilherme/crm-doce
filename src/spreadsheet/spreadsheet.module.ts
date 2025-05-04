import { Module } from '@nestjs/common';
import { SpreadsheetService } from './spreadsheet.service';
import { SpreadsheetController } from './spreadsheet.controller';
import { PrismaService } from 'src/config/prisma.client';
import { UserService } from 'src/user/user.service';
import { CrmService } from 'src/crm.service';
import { PedidoService } from 'src/pedido/pedido.service';

@Module({
  controllers: [SpreadsheetController],
  providers: [SpreadsheetService, PrismaService,UserService,CrmService, PedidoService],
})
export class SpreadsheetModule {}
