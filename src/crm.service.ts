import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from './config/prisma.client';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}
  // USER
  async matricuExiste(matricula: string) {
    await this.prisma.user.findUnique({
      where: { matricula: matricula },
    });
    if (matricula) {
      throw new ConflictException('Matricula já cadastrada');
    }
  }
  async emailExiste(email: string) {
    await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (email) {
      throw new ConflictException('Email já cadastrado');
    }
  }
  async contatoExiste(contato: string) {
    await this.prisma.user.findUnique({
      where: { contato: contato },
    });

    if (contato) {
      throw new ConflictException('Contato já cadastrado');
    }
  }
  async verficarId(id: string) {
    await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (id!) {
      throw new ConflictException('Id não encontrado');
    }
  }
}
