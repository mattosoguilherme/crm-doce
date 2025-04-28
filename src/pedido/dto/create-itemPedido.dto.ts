import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class CreateItemPedidoDto {
  @IsNumber({}, { message: 'O campo id deve ser um número' })
  @IsNotEmpty({ message: 'O campo id não pode ser vazio' })
  @ApiProperty({ default: 1 })
  id: number;

  @IsNumber({}, { message: 'O campo qtd deve ser um número' })
  @IsNotEmpty({ message: 'O campo qtd não pode ser vazio' })
  @ApiProperty({ default: 2 })
  quantidade: number;

  @IsNumber({}, { message: 'O campo valor_unitario deve ser um número' }) 
  @IsNotEmpty({ message: 'O campo valor_unitario não pode ser vazio' }) 
  @ApiProperty({ default: 12.1 })
  preco: number;

  @IsBoolean({ message: 'O campo active deve ser um booleano' })
  @IsNotEmpty({ message: 'O campo active não pode ser vazio' })
  @ApiProperty({ default: true })
  active: boolean;
  
  @IsString({ message: 'O campo descricao deve ser uma string' })
  @IsNotEmpty({ message: 'O campo descricao não pode ser vazio' })
  @ApiProperty({ default: 'Produto de teste' })
  descricao: string;

  @IsString({ message: 'O campo titulo deve ser uma string' })
  @IsNotEmpty({ message: 'O campo titulo não pode ser vazio' })
  @ApiProperty({ default: 'Produto de teste' })
  titulo: string;

  @IsString({ message: 'O campo urlFoto deve ser uma string' })
  @IsNotEmpty({ message: 'O campo urlFoto não pode ser vazio' })
  @ApiProperty({ default: 'http://teste.com.br/foto.png' })
  urlFoto: string;

}
