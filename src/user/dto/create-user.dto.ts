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
}
