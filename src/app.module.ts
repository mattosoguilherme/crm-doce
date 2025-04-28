import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PedidoModule } from './pedido/pedido.module';
import { EstoqueModule } from './estoque/estoque.module';
import { CardapioModule } from './cardapio/cardapio.module';
import { SpreadsheetService } from './spreadsheet/spreadsheet.service';
import { SpreadsheetController } from './spreadsheet/spreadsheet.controller';

@Module({
  imports: [UserModule, PedidoModule, EstoqueModule, CardapioModule],
  controllers: [SpreadsheetController],
  providers: [SpreadsheetService],
})
export class AppModule {}
