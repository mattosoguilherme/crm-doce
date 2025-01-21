import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';

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
}
