import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCardapioDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty( {default:"https://benditosalgado.com.br/wp-content/uploads/2022/06/Morango-Coberto-Doce-de-Leite-Branco2.jpg"})
  urlFoto: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty( {default:"doce teste"})
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty( {default:"doce feito de teste, com granulado e recheio de teste"})
  descricao: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty( {default:12.00})
  preco: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty( {default:12.00})
  cpu: number;


  @IsNumber()
  @IsNotEmpty()
  @ApiProperty( {default:12.00})
  cpl: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty( {default:12.00})
  lucro: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty( {default:12.00})
  quantidade_lote: number;

}
