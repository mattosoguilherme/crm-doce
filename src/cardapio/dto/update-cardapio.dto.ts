import { PartialType } from '@nestjs/swagger';
import { CreateCardapioDto } from './create-cardapio.dto';
import { IsOptional } from 'class-validator';

export class UpdateCardapioDto extends PartialType(CreateCardapioDto) {
  @IsOptional()
  descricao?: string;
  @IsOptional()
  preco?: number;
  @IsOptional()
  titulo?: string;
  @IsOptional()
  urlFoto?: string;
}
