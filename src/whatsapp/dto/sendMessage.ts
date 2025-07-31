import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SendMessage {


  @IsString({ message: "O msg deve ser um texto" })
  @ApiProperty({ description: "mensagem com a comanada do cliente", default: "segue sua comanda. *mensagem teste*" })
  @IsNotEmpty({ message: "A msg não pode ser vazia" })
  msg: string;

  @IsString({ message: "O telefone deve ser um texto" })
  @ApiProperty({ description: "telefone do cliente", default: "55999999999" })
  @IsNotEmpty({ message: "O telefone não pode ser vazio" })
  telefone: string;

}
