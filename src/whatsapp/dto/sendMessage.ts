import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SendMessage {

  @IsNumber({},{ message: "O comanda_id deve ser um número" })
  @ApiProperty({ description: "ID da comanda", default: 1})
  @IsNotEmpty({ message: "O comanda_id não pode ser vazio" })
  id_comanda: number;

  @IsString({ message: "O msg deve ser um texto" })
  @ApiProperty({ description: "mensagem com a comanada do cliente", default: "segue sua comanda. *mensagem teste*" })
  @IsNotEmpty({ message: "A msg não pode ser vazia" })
  msg: string;

  @IsString({ message: "O telefone deve ser um texto" })
  @ApiProperty({ description: "telefone do cliente", default: "55999999999" })
  @IsNotEmpty({ message: "O telefone não pode ser vazio" })
  telefone: string;

}
