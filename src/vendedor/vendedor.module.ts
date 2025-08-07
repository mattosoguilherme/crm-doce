import { Module } from '@nestjs/common';
import { VendedorService } from './vendedor.service';
import { VendedorController } from './vendedor.controller';
import { CrmService } from 'src/crm.service';
import { PrismaService } from 'src/config/prisma.client';

@Module({
  controllers: [VendedorController],
  providers: [VendedorService, CrmService,PrismaService],
})
export class VendedorModule {}
