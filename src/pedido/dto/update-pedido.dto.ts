import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePedidoDto } from './create-pedido.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateItemPedidoDto } from './create-itemPedido.dto';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @IsOptional()
  status?: string;

  @IsOptional()
  user_id?: string;

  @IsOptional()
  itens_id?: CreateItemPedidoDto[];

  @IsOptional()
  metodo_pagamento?: string;

  @IsOptional()
  valor_total?: number;

  @IsOptional()
  total?: number;

  @IsNumber({}, { message: 'O campo id_pedido deve ser um número' })
  @IsOptional()
  @ApiProperty({ default: 1 })
  id_pedido: number;
}
