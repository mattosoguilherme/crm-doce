import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePedidoDto {
  @IsString({ message: 'O campo user_id deve ser uma string' })
  @IsNotEmpty({ message: 'O campo user_id não pode ser vazio' })
  @ApiProperty( { default: 'cm6e0rumn0000pzf89ldfix8m' } )
  user_id: string;

  @IsArray({ message: 'O campo items_id deve ser um array' })
  @IsNotEmpty({ message: 'O campo items_id não pode ser vazio' })
  @ApiProperty( { default: [1] } )
  items_id: number[];

  @IsString({ message: 'O campo status deve ser uma string' })
  @IsNotEmpty({ message: 'O campo status não pode ser vazio' })
  @ApiProperty( { default: 'PENDENTE' } )
  status: string;

}
