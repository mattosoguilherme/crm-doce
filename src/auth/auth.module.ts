import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CrmService } from 'src/crm.service';
import { PrismaService } from 'src/config/prisma.client';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CrmService, PrismaService, RolesGuard, JwtStrategy],
})
export class AuthModule {}
