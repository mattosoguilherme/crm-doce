import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/config/prisma.client';
import { User } from '@prisma/client';
import { CrmService } from 'src/crm.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private crm: CrmService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { contato, email, matricula, password, confirmPassword } =
      createUserDto;

    await this.crm.matriculaValid(matricula);
    await this.crm.emailValid(email);
    await this.crm.contatoValid(contato);

    if (password !== confirmPassword) {
      throw new ConflictException('As senhas não são iguais');
    }

    createUserDto['password'] = await bcrypt.hash(password, 10);

    delete createUserDto.confirmPassword;

    return await this.prisma.user.create({
      data: {
        contato: contato,
        email: email,
        matricula: matricula,
        nome: this.crm.titleize(createUserDto.nome),
        aniversario: new Date(createUserDto.aniversario),
        produto: createUserDto.produto,
        unidade: createUserDto.unidade,
        password: createUserDto.password,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
  async findOne(id: string): Promise<User> {
    await this.crm.findUserById(id);
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async delete(id: string): Promise<User> {
    await this.crm.findUserById(id);
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.crm.findUserById(id);

    const userUpadted = await this.crm.fieldUniqueUpdateValid(
      updateUserDto,
      id,
    );

    return await this.prisma.user.update({
      where: { id },
      data: {
        contato: userUpadted.contato,
        email: userUpadted.email,
        matricula: userUpadted.matricula,
        nome: userUpadted.nome,
        aniversario: userUpadted.aniversario,
        produto: userUpadted.produto,
        unidade: userUpadted.unidade,
        password: userUpadted.password,
      },
    });
  }
}
