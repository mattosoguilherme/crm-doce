import { Injectable } from '@nestjs/common';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { UpdateVendedorDto } from './dto/update-vendedor.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/config/prisma.client';
import { CrmService } from 'src/crm.service';

@Injectable()
export class VendedorService {
  constructor(
    private prisma: PrismaService,
    private crmService: CrmService,
  ) {}

  async create({
    nome,
    email,
    telefone,
    password,
    confirmPassword,
  }: CreateVendedorDto) {
    if (password !== confirmPassword) {
      throw new Error('Senhas não conferem');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendedor = await this.prisma.vendedor.create({
      data: {
        nome,
        email,
        telefone,
        password: hashedPassword,
      },
    });

    return vendedor;
  }

  async findAll() {
    return this.prisma.vendedor.findMany();
  }

  async findOne(id: number) {
    return await this.crmService.findVendedorById(id);
  }

  async update(
    id: number,
    {
      nome,
      email,
      telefone,
      password,
      confirmPassword,
      passwordAtual,
    }: UpdateVendedorDto,
  ) {
    const vendedor = await this.crmService.findVendedorById(id);

    if (!vendedor) {
      throw new Error('Vendedor não encontrado');
    }

    if (password !== confirmPassword) {
      throw new Error('Senhas não conferem');
    }

    const isPasswordValid = await bcrypt.compare(
      passwordAtual,
      vendedor.password,
    );

    if (!isPasswordValid) {
      throw new Error('Senha atual inválida');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.vendedor.update({
      where: { id },
      data: {
        nome,
        email,
        telefone,
        password: hashedPassword,
      },
    });
  }

  async remove(id: number) {
    const vendedor = await this.crmService.findVendedorById(id);
    if (!vendedor) {
      throw new Error('Vendedor não encontrado');
    }
    return this.prisma.vendedor.delete({
      where: { id },
    });
  }
}
