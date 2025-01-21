import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/config/prisma.client';
import { CrmService } from 'src/crm.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, CrmService],
})
export class UserModule {}
