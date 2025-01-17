import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/config/prisma.client';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { contato, email, matricula } = createUserDto;

    const VerifyContato = await this.prisma.user.findUnique({
      where: { contato: contato },
    });

    if (VerifyContato) {
      throw new ConflictException('Contato já cadastrado');
    }

    const VerifyEmail = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (VerifyEmail) {
      throw new ConflictException('Email já cadastrado');
    }

    const VerifyMatricula = await this.prisma.user.findUnique({
      where: { matricula: matricula },
    });
    if (VerifyMatricula) {
      throw new ConflictException('Matricula já cadastrada');
    }

    return await this.prisma.user.create({ data: createUserDto });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
