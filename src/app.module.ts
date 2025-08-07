import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PedidoModule } from './pedido/pedido.module';
import { CardapioModule } from './cardapio/cardapio.module';
import { SpreadsheetModule } from './spreadsheet/spreadsheet.module';
import { ComandaModule } from './comanda/comanda.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { AuthModule } from './auth/auth.module';
import { VendedorModule } from './vendedor/vendedor.module';
import { RelatorioModule } from './relatorio/relatorio.module';


@Module({
  imports: [
    UserModule,
    PedidoModule,
  
    CardapioModule,
    SpreadsheetModule,
    ComandaModule,
    WhatsappModule,
    AuthModule,
    VendedorModule,
    RelatorioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
