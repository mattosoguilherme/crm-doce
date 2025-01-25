import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PedidoModule } from './pedido/pedido.module';
import { EstoqueModule } from './estoque/estoque.module';
import { CardapioModule } from './cardapio/cardapio.module';

@Module({
  imports: [UserModule, PedidoModule, EstoqueModule, CardapioModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
