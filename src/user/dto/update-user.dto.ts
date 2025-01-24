import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  email?: string;

  @IsOptional()
  aniversario?: string;

  @IsOptional()
  contato?: string;

  @IsOptional()
  matricula?: string;

  @IsOptional()
  nome?: string;

  @IsOptional()
  produto?: string;

  @IsOptional()
  unidade?: string;

  @IsOptional()
  @IsString()
  @Length(4, 8)
  @ApiProperty({
    default: '123456',
  })
  actualPassword?: string;

  @IsOptional()
  @IsString()
  @Length(4, 8)
  @ApiProperty({
    default: '2003',
  })
  newPassword?: string;

  @IsOptional()
  @IsString()
  @Length(4, 8)
  @ApiProperty({
    default: '2003',
  })
  confirmNewPassword?: string;
}
