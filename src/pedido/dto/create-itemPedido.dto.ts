import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateItemPedidoDto {
  @IsNumber({}, { message: 'O campo id deve ser um número' })
  @IsNotEmpty({ message: 'O campo id não pode ser vazio' })
  @ApiProperty({ default: 1 })
  id: number;

  @IsNumber({}, { message: 'O campo qtd deve ser um número' })
  @IsNotEmpty({ message: 'O campo qtd não pode ser vazio' })
  @ApiProperty({ default: 2 })
  qtd: number;

  @IsNumber({}, { message: 'O campo valor_unitario deve ser um número' }) 
  @IsNotEmpty({ message: 'O campo valor_unitario não pode ser vazio' }) 
  @ApiProperty({ default: 12.1 })
  valor_unitario: number;
}
