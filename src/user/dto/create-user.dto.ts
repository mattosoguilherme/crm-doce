import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    default: 'teste@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'Teste da Silva',
  })
  nome: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: '119760706070',
  })
  contato: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'Teste',
  })
  produto: string;

  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'VT',
  })
  equipe: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'Mogi 2',
  })
  unidade: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: '357662',
  })
  matricula: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    default: '2021-10-10',
  })
  aniversario: string;
}
