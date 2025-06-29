import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PedidoModule } from './pedido/pedido.module';
import { EstoqueModule } from './estoque/estoque.module';
import { CardapioModule } from './cardapio/cardapio.module';
import { SpreadsheetModule } from './spreadsheet/spreadsheet.module';
import { ComandaModule } from './comanda/comanda.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    UserModule,
    PedidoModule,
    EstoqueModule,
    CardapioModule,
    SpreadsheetModule,
    ComandaModule,
    WhatsappModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
