import { PartialType } from '@nestjs/swagger';
import { CreatePedidoDto } from './create-pedido.dto';
import { IsOptional } from 'class-validator';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {


  @IsOptional()
  status?: string;

  @IsOptional()
  user_id?: string;
}
