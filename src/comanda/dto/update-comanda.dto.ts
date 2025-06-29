import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UpdatePedidoDto } from 'src/pedido/dto/update-pedido.dto';

export class UpdateComandaDto {
  @IsOptional()
  @IsString({ message: 'campo status é do tipo string' })
  @ApiProperty({
    description: 'Status da comanda',
    default: 'PAGO',
  })
  status: string;

  @IsOptional()
  @IsNumber({}, { message: 'campo saldo_pendente é do tipo number' })
  @ApiProperty({
    description: 'Saldo pendente da comanda',
    default: 0,
  })
  saldo_pendente: number;

  @IsOptional()
  @IsNumber({}, { message: 'campo saldo_quitado é do tipo number' })
  @ApiProperty({
    description: 'Saldo quitado da comanda',
    default: 0,
  })
  saldo_quitado: number;

  @IsOptional()
  @IsNumber({}, { message: 'campo total é do tipo number' })
  @ApiProperty({
    description: 'Total da comanda',
    default: 0,
  })
  total: number;

  @IsOptional()
  @IsArray({ message: 'campo pedidoId é do tipo array' })
  @ApiProperty({
    description: 'Lista de IDs de pedidos a serem removidos',
    default: [1, 2, 3],
  })
  pedidoIdRemoved: number[];

  @IsOptional()
  @IsArray({ message: 'campo pedidoEdit é do tipo array' })
  @ApiProperty({
    description: 'Lista de pedidos a serem editados ou acrescentados',
    default: [
      {
        id: 1,
        itens_id: [
          {
            id: 1,
            quantidade: 2,
            preco: 10.0,
          },
        ],
        user_id: 1,
        status: 'PAGO',
        metodo_pagamento: 'CARTAO',
        total: 20.0,
        data: new Date(),
      },
    ],
  })
  pedidoEdit: UpdatePedidoDto[];

  @IsOptional()
  @IsBoolean({ message: 'campo sended é do tipo boolean' })
  @ApiProperty({
    description: 'Campo para verificar se o pedido foi enviado',
    default: false,
  })
  sended: boolean;
}
