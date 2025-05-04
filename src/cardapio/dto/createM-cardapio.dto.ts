import { ApiProperty } from '@nestjs/swagger';
import { CreateCardapioDto } from './create-cardapio.dto';
import { IsArray } from 'class-validator';

export class CreateMCardapio extends CreateCardapioDto {
  @ApiProperty({
    default: [
      {
        urlFoto:
          ' https://benditosalgado.com.br/wp-content/uploads/2022/06/Morango-Coberto-Doce-de-Leite-Branco2.jpg',

        titulo: 'string',

        descricao: 'string',

        preco: 0,

        cpu: 0,

        cpl: 0,

        lucro: 0,

        quantidade_lote: 0,
      },
    ],
  })
  @IsArray()
  items: CreateCardapioDto[];
}
