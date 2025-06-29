import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/config/prisma.client';

interface JwtPayload {
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // agora vai respeitar a expiração
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prismaService.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      throw new UnauthorizedException('Token inválido ou usuário não encontrado');
    }

    return user; // pode também retornar um DTO específico se quiser limitar os dados
  }
}
