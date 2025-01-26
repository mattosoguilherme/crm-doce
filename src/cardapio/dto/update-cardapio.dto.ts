import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCardapioDto } from './create-cardapio.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCardapioDto extends PartialType(CreateCardapioDto) {
  @IsOptional()
  descricao?: string;
  @IsOptional()
  preco?: number;
  @IsOptional()
  titulo?: string;
  @IsOptional()
  urlFoto?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: true })
  active?: boolean;
}
