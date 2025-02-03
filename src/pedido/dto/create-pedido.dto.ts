import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateItemPedidoDto } from './create-itemPedido.dto';

export class CreatePedidoDto {
  @IsString({ message: 'O campo user_id deve ser uma string' })
  @IsNotEmpty({ message: 'O campo user_id não pode ser vazio' })
  @ApiProperty({ default: 'cm6odj3w80000pzjgjku4mtn0' })
  user_id: string;

  @IsArray({ message: 'O campo items_id deve ser um array' })
  @IsNotEmpty({ message: 'O campo items_id não pode ser vazio' })
  @ApiProperty({
    default: [
      { id: 1, qtd: 2, valor_unitario: 12.1 },
      { id: 2, qtd: 2, valor_unitario: 12.1 },
      { id: 3, qtd: 2, valor_unitario: 12.1 },
    ],
  })
  itens_id: CreateItemPedidoDto[];

  @IsString({ message: 'O campo status deve ser uma string' })
  @IsNotEmpty({ message: 'O campo status não pode ser vazio' })
  @ApiProperty({ default: 'PENDENTE' })
  status: string;

  @IsString({ message: 'O campo metodo_pagamento deve ser uma string' })
  @IsNotEmpty({ message: 'O campo metodo_pagamento não pode ser vazio' })
  @ApiProperty({ default: 'PIX' })
  metodo_pagamento: string;

  @IsNumber({}, { message: 'O campo total deve ser um número' })
  @IsNotEmpty({ message: 'O campo total não pode ser vazio' })
  @ApiProperty({ default: 100.1 })
  total: number;
}
