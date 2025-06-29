import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginInputDto } from './dto/loginInput.dto';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { CrmService } from 'src/crm.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private crmService:CrmService) {}
  async login({ email, senha }: LoginInputDto): Promise<LoginResponseDto> {
    const FindedUser = await this.crmService.findUserByEmail(email);

    const senha_valida = await bcrypt.compare(senha, FindedUser.password);

    if (!senha_valida) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }

    delete FindedUser.password;

    return {
      token: this.jwtService.sign({ email }),
      user: FindedUser,
    };
  }
}