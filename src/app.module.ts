import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PedidoModule } from './pedido/pedido.module';
import { EstoqueModule } from './estoque/estoque.module';

@Module({
  imports: [UserModule, PedidoModule, EstoqueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
