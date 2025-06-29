import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    default: 'guilhermemktfran@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'guilherme mattoso',
  })
  nome: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: '11992767398',
  })
  contato: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'alelo',
  })
  produto: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'mogi 2',
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
    default: '2003-07-08',
  })
  aniversario: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 8)
  @ApiProperty({
    default: '123456',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 8)
  @ApiProperty({
    default: '123456',
  })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'CAE PREMIUM',
  })
  celula: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'Alelo',
  })
  operacao: string;
}
