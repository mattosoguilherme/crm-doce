import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVendedorDto } from './create-vendedor.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVendedorDto extends PartialType(CreateVendedorDto) {

    @ApiProperty({
        description: 'Nome do vendedor',
        default: 'guilherme mattoso',
    })
    @IsOptional()
    nome: string;

    @ApiProperty({
        description: 'Email do vendedor',
        default: 'guilherme.mattoso@dtl.com',
    })
    @IsOptional()
    email: string;

    @ApiProperty({
        description: 'Telefone do vendedor',
        default: '11992767398',
    })
    @IsOptional()
    telefone: string;

    @ApiProperty({
        description: 'Senha do vendedor',
        default: '1234',
    })
    @IsOptional()
    password: string;

    @ApiProperty({
        description: 'Confirmação da senha do vendedor',
        default: '1234',
    })
    @IsOptional()
    confirmPassword: string;

    @ApiProperty({
        description: 'Senha atual do vendedor',
        default: 'senha123',
    })
    @IsOptional()
    @IsString()
    passwordAtual: string;
}
