import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PedidoModule } from './pedido/pedido.module';
import { EstoqueModule } from './estoque/estoque.module';

@Module({
  imports: [UserModule, PedidoModule, EstoqueModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
