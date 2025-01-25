import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCardapioDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty( {default:"https://static.vecteezy.com/ti/vetor-gratis/p1/15218223-de-contorno-de-icone-de-cupcake-de-creme-liquido-doce-vetor.jpg"})
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
}
