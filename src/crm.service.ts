import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from './config/prisma.client';
import { User } from '@prisma/client';
import { UpdateUserDto } from './user/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  titleize(text: string) {
    var words = text.toLowerCase().split(' ');

    for (var i = 0; i < words.length; i++) {
      var w: string = words[i];
      words[i] = w[0].toUpperCase() + w.slice(1);
    }
    const n: string = words.join();
    return n.replace(/,/g, ' ');
  }

  // USER
  async matriculaValid(matricula: string) {
    await this.prisma.user.findUnique({
      where: { matricula: matricula },
    });
    if (matricula) {
      throw new ConflictException('Matricula já cadastrada');
    }
  }
  async emailValid(email: string) {
    await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (email) {
      throw new ConflictException('Email já cadastrado');
    }
  }
  async contatoValid(contato: string) {
    await this.prisma.user.findUnique({
      where: { contato: contato },
    });

    if (contato) {
      throw new ConflictException('Contato já cadastrado');
    }
  }
  async findUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (user!) {
      throw new ConflictException('Id não encontrado');
    }

    return user;
  }

  // verificando campo unicos

  async fieldUniqueUpdateValid(
    userUpdate: UpdateUserDto,
    id: string,
  ): Promise<User> {
    const {
      newPassword,
      confirmNewPassword,
      matricula,
      email,
      contato,
      actualPassword,
    } = userUpdate;

    const userBefore = await this.prisma.user.findUnique({ where: { id: id } });

    const userAfter = {
      id: userBefore.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      email: userBefore.email,
      password: userBefore.password,
      nome: userBefore.nome,
      contato: userBefore.contato,
      produto: userBefore.produto,
      unidade: userBefore.unidade,
      matricula: userBefore.matricula,
      aniversario: userBefore.aniversario,
    };

    if (userUpdate.nome) {
      const n = this.titleize(userUpdate.nome);
      userAfter.nome = n;
    }

    if (newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        throw new ConflictException('As senhas não são iguais');
      }

      const match = await bcrypt.compare(actualPassword, userBefore.password);

      if (!match) {
        throw new ConflictException('Senha incorreta');
      }

      const hash = await bcrypt.hash(newPassword, 10);

      userAfter.password = hash;
    }

    if (matricula) {
      await this.matriculaValid(matricula);
      userAfter.matricula = matricula;
    }

    if (email) {
      await this.emailValid(email);
      userAfter.email = email;
    }

    if (contato) {
      await this.contatoValid(contato);
      userAfter.contato = contato;
    }

    return userAfter;
  }
}
