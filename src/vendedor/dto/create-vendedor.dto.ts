import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateVendedorDto {
   
  @IsNotEmpty()  
  @IsString()
  @ApiProperty({
    description: 'Nome do vendedor',
    default: 'João Silva',
  })
  nome: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'Email do vendedor',
    default: 'joao.silva@dtl.com',
  })    
  email: string;

  @IsNotEmpty() 
  @IsString()
  @ApiProperty({
    description: 'Telefone do vendedor',
    default: '11992767398',
  })
  telefone: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Senha do vendedor',
    default: 'senha123',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Confirmação da senha do vendedor',
    default: 'senha123',
  })
  confirmPassword: string;
}
