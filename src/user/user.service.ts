import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/config/prisma.client';
import { User } from '@prisma/client';
import { CrmService } from 'src/crm.service';
import { CreateTUser } from './dto/createT.dto';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private crm: CrmService,
  ) {}

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
        celula: createUserDto.celula,
        operacao: createUserDto.operacao,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      include: {
        Pedidos: true,
        Comanda: true,
      },
    });
  }
  async findOne(id: string): Promise<User> {
    await this.crm.findUserById(id);
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        Pedidos: true,
        Comanda: true,
      },
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

  async createT(createUserDto: CreateTUser): Promise<User> {
    const { contato, email, password } = createUserDto;

    await this.crm.matriculaValid(contato.substring(0, 7));
    await this.crm.emailValid(email);
    await this.crm.contatoValid(contato);

    createUserDto['password'] = await bcrypt.hash(password, 10);

    return await this.prisma.user.create({
      data: {
        contato: contato,
        email: email.toLocaleLowerCase(),
        matricula: contato.substring(0, 7),
        nome: this.crm.titleize(createUserDto.nome),
        aniversario: new Date('1999-01-01'),
        produto: createUserDto.produto,
        unidade: createUserDto.unidade,
        password: createUserDto.password,
      },
    });
  }

  async createMany(): Promise<User[]> {
    const listaCreate: CreateTUser[] = [
      {
        email: 'super.danise@altera.com',
        password: '1234',
        nome: 'Super Danise',
        contato: '11917553607',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'natalia.leal@altera.com',
        password: '1234',
        nome: 'NATALIA LEAL',
        contato: '11952905308',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'victor.leon@altera.com',
        password: '1234',
        nome: 'VICTOR LEON',
        contato: '11964277405',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'camila.soares@altera.com',
        password: '1234',
        nome: 'Camila Soares',
        contato: '11983001189',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'melissa.rodrigues@altera.com',
        password: '1234',
        nome: 'Melissa Rodrigues',
        contato: '11990199277',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'bruna.aparecida@altera.com',
        password: '1234',
        nome: 'Bruna Aparecida',
        contato: '11987483256',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'ciara@altera.com',
        password: '1234',
        nome: 'Ciara',
        contato: '11974893127',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'daniela.caroline@altera.com',
        password: '1234',
        nome: 'Daniela Caroline',
        contato: '11978361766',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'giovanna.k@altera.com',
        password: '1234',
        nome: 'Giovanna K.',
        contato: '11950839888',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'hingris.cristina@altera.com',
        password: '1234',
        nome: 'Hingris Cristina',
        contato: '11946028455',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'isabela.cir@altera.com',
        password: '1234',
        nome: 'ISABELA CIR',
        contato: '11992068177',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'jessica.monteiro@altera.com',
        password: '1234',
        nome: 'Jessica Monteiro',
        contato: '11953016391',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'kelly.cristina@altera.com',
        password: '1234',
        nome: 'Kelly Cristina',
        contato: '11970316586',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'luiz.edu@altera.com',
        password: '1234',
        nome: 'LUIZ EDU',
        contato: '11997809762',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'male@altera.com',
        password: '1234',
        nome: 'Male',
        contato: '11939224737',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'maria.eduarda.barreto@altera.com',
        password: '1234',
        nome: 'Maria Eduarda Barreto',
        contato: '11957849656',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'milene.talita@altera.com',
        password: '1234',
        nome: 'Milene Talita',
        contato: '11930555438',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'nathaxa.daniely@altera.com',
        password: '1234',
        nome: 'Nathaxa Daniely',
        contato: '11952831796',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'super.jessica@altera.com',
        password: '1234',
        nome: 'Super Jessica',
        contato: '11930512736',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'yasmin.vitoria@exemplo.com',
        password: '1234',
        nome: 'Yasmin Vitoria',
        contato: '11958246382',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'bia.treinamento@exemplo.com',
        password: '1234',
        nome: 'Bia Treinamento',
        contato: '11997414630',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'fabiola.alves@exemplo.com',
        password: '1234',
        nome: 'Fabiola Alves',
        contato: '11999065685',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'fernanda@exemplo.com',
        password: '1234',
        nome: 'Fernanda',
        contato: '11987159059',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'grazielly.silva@exemplo.com',
        password: '1234',
        nome: 'Grazielly da Silva',
        contato: '11963533408',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'jheniffer.f@altera.com',
        password: '1234',
        nome: 'Jheniffer F.',
        contato: '11968760522',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'karolina.loira@altera.com',
        password: '1234',
        nome: 'Karolina Loira',
        contato: '11934895406',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'lauren.luiza@altera.com',
        password: '1234',
        nome: 'Lauren Luiza',
        contato: '918988123',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'talias@altera.com',
        password: '1234',
        nome: 'Talias',
        contato: '11916962475',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'ana.karoline.reis@altera.com',
        password: '1234',
        nome: 'Ana Karoline Reis',
        contato: '11971753575',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'yasmin.barbosa@altera.com',
        password: '1234',
        nome: 'Yasmin Barbosa',
        contato: '11939433217',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'isabela.rodrigues@altera.com',
        password: '1234',
        nome: 'Isabela Rodrigues',
        contato: '11966492606',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'melissa.rodrigues@altera.com',
        password: '1234',
        nome: 'Melissa Rodrigues',
        contato: '11990199277',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'andressa.mt@altera.com',
        password: '1234',
        nome: 'Andressa MT',
        contato: '11943688794',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'cesar@altera.com',
        password: '1234',
        nome: 'Cesar',
        contato: '11942058517',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'evelyn@altera.com',
        password: '1234',
        nome: 'Evelyn',
        contato: '11910033308',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'ana.vitoria.rocha@altera.com',
        password: '1234',
        nome: 'Ana Vitória Rocha',
        contato: '11948814368',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'inaue@altera.com',
        password: '1234',
        nome: 'Inaue',
        contato: '11920071045',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'livia.mt@altera.com',
        password: '1234',
        nome: 'Livia MT',
        contato: '11977698553',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'maria.eduarda.pereira@altera.com',
        password: '1234',
        nome: 'Maria Eduarda Pereira',
        contato: '11930947974',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'camila.matias@altera.com',
        password: '1234',
        nome: 'Camila Matias',
        contato: '11912645119',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'matheus.cachos@altera.com',
        password: '1234',
        nome: 'Matheus Cachos',
        contato: '11972383586',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'mercia.stankevicius@altera.com',
        password: '1234',
        nome: 'Mércia Stankevicius',
        contato: '11966180742',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'carolina.lourenco@altera.com',
        password: '1234',
        nome: 'Carolina Lourenco',
        contato: '11942802534',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'noemi.vitoria@altera.com',
        password: '1234',
        nome: 'Noemi Vitoria',
        contato: '11982076672',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'priscila.limpeza@altera.com',
        password: '1234',
        nome: 'Priscila Limpeza',
        contato: '11980520401',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'raissa@altera.com',
        password: '1234',
        nome: 'Raissa',
        contato: '11986264407',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'thayna.vitoria@altera.com',
        password: '1234',
        nome: 'THAYNA VITORIA',
        contato: '11917316267',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'adriana.lacombe@altera.com',
        password: '1234',
        nome: 'Adriana Lacombe',
        contato: '11968104376',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'ana.vitoria.rocha@altera.com',
        password: '1234',
        nome: 'Ana Vitória Rocha',
        contato: '11948814368',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'andreza.aparecida@altera.com',
        password: '1234',
        nome: 'Andreza Aparecida',
        contato: '11988666043',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'daiane.apolonio@altera.com',
        password: '1234',
        nome: 'daiane Apolonio',
        contato: '11971669969',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'daiany.marcell@altera.com',
        password: '1234',
        nome: 'Daiany Marcella',
        contato: '11951593405',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'erik.caique@altera.com',
        password: '1234',
        nome: 'Erik Caique',
        contato: '11975763190',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'joao.vitor.nicacio@altera.com',
        password: '1234',
        nome: 'João Vitor Nicacio',
        contato: '11980444576',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'joyce.jamily@altera.com',
        password: '1234',
        nome: 'Joyce Jamily',
        contato: '11945776448',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'karina.pessoa@altera.com',
        password: '1234',
        nome: 'Karina Pessoa',
        contato: '11911036051',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'larissa.dantas@altera.com',
        password: '1234',
        nome: 'Larissa Dantas',
        contato: '11947131975',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'lavigne@altera.com',
        password: '1234',
        nome: 'Lavigne',
        contato: '11919941682',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },

      {
        email: 'dyovanna@altera.com',
        password: '1234',
        nome: 'Dyovanna',
        contato: '11932597821',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'neide.kalyandra@altera.com',
        password: '1234',
        nome: 'Neide Kalyandra',
        contato: '11964705673',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'samira@altera.com',
        password: '1234',
        nome: 'Samira',
        contato: '11951642997',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'sergio@altera.com',
        password: '1234',
        nome: 'SERGIO',
        contato: '11968635616',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'thais.silva@altera.com',
        password: '1234',
        nome: 'THAIS DA SILVA',
        contato: '11956495142',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'elisabeth@example.com',
        password: '1234',
        nome: 'Elisabeth',
        contato: '11941455639',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'victoria.andreina@example.com',
        password: '1234',
        nome: 'Victoria Andreina',
        contato: '11948781222',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'beatriz.talissa@example.com',
        password: '1234',
        nome: 'Beatriz Talissa',
        contato: '11970355431',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'elzir@example.com',
        password: '1234',
        nome: 'Elzir',
        contato: '11941701284',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'cauan.dos.santos@example.com',
        password: '1234',
        nome: 'Cauan dos Santos',
        contato: '11974438009',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'danilo.lima@example.com',
        password: '1234',
        nome: 'Danilo Lima',
        contato: '11932534362',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'joao.vitor.nicacio@example.com',
        password: '1234',
        nome: 'João Vitor Nicacio',
        contato: '1198044576',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'karolina.loira@example.com',
        password: '1234',
        nome: 'Karolina Loira',
        contato: '11934895406',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'kelly.coordenadora@example.com',
        password: '1234',
        nome: 'Kelly Coordenadora',
        contato: '11998207389',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'regiane.amil@example.com',
        password: '1234',
        nome: 'Regiane AMIL benef',
        contato: '11943893900',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'tamires.martins@example.com',
        password: '1234',
        nome: 'Tamires Martins',
        contato: '11977115967',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'luana.arikawa@example.com',
        password: '1234',
        nome: 'Luana Arikawa',
        contato: '11986141548',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'mariana.alves.cunha@example.com',
        password: '1234',
        nome: 'Mariana Alves Cunha',
        contato: '11968281220',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'erika.vanessa@example.com',
        password: '1234',
        nome: 'Erika Vanessa',
        contato: '11947563854',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'melissa.goncalves@example.com',
        password: '1234',
        nome: 'Melissa Gonçalves',
        contato: '11991695773',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'super.elis@example.com',
        password: '1234',
        nome: 'Super Elis',
        contato: '11950239369',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'grazielly.silva@example.com',
        password: '1234',
        nome: 'Grazielly da Silva',
        contato: '11963533408',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'andre.coordenador@example.com',
        password: '1234',
        nome: 'André Coordenador',
        contato: '11986172881',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'fatima@example.com',
        password: '1234',
        nome: 'FATIMA',
        contato: '11999927223',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'karen.velha@example.com',
        password: '1234',
        nome: 'Karen Velha',
        contato: '11997474393',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'maria.eduarda.reis@example.com',
        password: '1234',
        nome: 'Maria Eduarda Reis',
        contato: '13991588910',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'gabriel.diniz@example.com',
        password: '1234',
        nome: 'Gabriel Diniz',
        contato: '11988270864',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'gaby.smart@example.com',
        password: '1234',
        nome: 'Gaby Smart',
        contato: '11953058972',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'raissa.edp@example.com',
        password: '1234',
        nome: 'Raissa EDP',
        contato: '11986264407',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'super.emilly@example.com',
        password: '1234',
        nome: 'Super Emilly',
        contato: '11993981051',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'talias@example.com',
        password: '1234',
        nome: 'Talias',
        contato: '11916962475',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'isabela.rodrigues@example.com',
        password: '1234',
        nome: 'Isabela Rodrigues',
        contato: '11966492606',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'larissa.fernanda@example.com',
        password: '1234',
        nome: 'Larissa Fernanda',
        contato: '11959072761',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'miriam.moreira@example.com',
        password: '1234',
        nome: 'Miriam Moreira',
        contato: '11975644983',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'rosilaine@example.com',
        password: '1234',
        nome: 'Rosilaine',
        contato: '11943577945',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'jefferson.c@example.com',
        password: '1234',
        nome: 'Jefferson C',
        contato: '11969432405',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'joana@example.com',
        password: '1234',
        nome: 'Joana',
        contato: '11910773358',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'inae.barros@example.com',
        password: '1234',
        nome: 'Inae Barros',
        contato: '11937576351',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'victor.sales@example.com',
        password: '1234',
        nome: 'Victor Sales',
        contato: '11917890615',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'joyce.cristine@example.com',
        password: '1234',
        nome: 'Joyce Cristine',
        contato: '11933819477',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'nicoli.suporte@example.com',
        password: '1234',
        nome: 'Nicoli Suporte',
        contato: '11972668837',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'roberta@example.com',
        password: '1234',
        nome: 'Roberta',
        contato: '11996629272',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'beatriz.ribeiro@example.com',
        password: '1234',
        nome: 'Beatriz Ribeiro',
        contato: '11970823088',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'livia.carolina@example.com',
        password: '1234',
        nome: 'Livia Carolina M.',
        contato: '11975037390',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'leticia.gloria@example.com',
        password: '1234',
        nome: 'Leticia Gloria',
        contato: '11993519472',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'maria.eduarda.silva@example.com',
        password: '1234',
        nome: 'Maria Eduarda Silva',
        contato: '11961005168',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'super.aline@example.com',
        password: '1234',
        nome: 'Super Aline',
        contato: '11964955239',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'fabiana@example.com',
        password: '1234',
        nome: 'Fabiana',
        contato: '11959812377',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'luana.amil@example.com',
        password: '1234',
        nome: 'Luana Amil',
        contato: '11966448293',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'luisa.bezera@example.com',
        password: '1234',
        nome: 'Luisa Bezerra',
        contato: '11952748867',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'ana.beatriz@example.com',
        password: '1234',
        nome: 'Ana Beatriz',
        contato: '11937409836',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'bruna.toth@example.com',
        password: '1234',
        nome: 'Bruna Toth',
        contato: '11941279224',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'isabela.rodrigues@example.com',
        password: '1234',
        nome: 'Isabela Rodrigues',
        contato: '11966492606',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'maria.luiza@example.com',
        password: '1234',
        nome: 'Maria Luiza',
        contato: '11941460902',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'melissa.golcalves@example.com',
        password: '1234',
        nome: 'Melissa Golçalves',
        contato: '11991695773',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'melissa.golcalves@example.com',
        password: '1234',
        nome: 'Melissa Golçalves',
        contato: '11991695773',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'naiara@example.com',
        password: '1234',
        nome: 'Naiara',
        contato: '11948155260',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'raissa@example.com',
        password: '1234',
        nome: 'Raissa',
        contato: '11986264407',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'marjo@example.com',
        password: '1234',
        nome: 'Marjo',
        contato: '11911771198',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'hellryn.janis@example.com',
        password: '1234',
        nome: 'Hellryn Janis',
        contato: '11964330586',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'michaella@example.com',
        password: '1234',
        nome: 'Michaella',
        contato: '11960840215',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'natalia.bruna@example.com',
        password: '1234',
        nome: 'Natalia Bruna',
        contato: '11958007529',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'nathaly@example.com',
        password: '1234',
        nome: 'Nathaly',
        contato: 'PEGAR NUMERO',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'raquel.silva@example.com',
        password: '1234',
        nome: 'Raquel da Silva',
        contato: '11939297527',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'regiane.amil@example.com',
        password: '1234',
        nome: 'Regiane Amil',
        contato: '11943893900',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'renata.m@example.com',
        password: '1234',
        nome: 'Renata M',
        contato: '11950633877',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'roberta@example.com',
        password: '1234',
        nome: 'Roberta',
        contato: '11996629272',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'sergio.amil@example.com',
        password: '1234',
        nome: 'Sergio Amil',
        contato: '11968635616',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'raquel.silva2@example.com',
        password: '1234',
        nome: 'Raquel da Silva',
        contato: '11939237527',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'thaynara@example.com',
        password: '1234',
        nome: 'Thaynara',
        contato: '11913545093',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'debora@example.com',
        password: '1234',
        nome: 'Debora',
        contato: '11990119967',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'mariana.berenguel@example.com',
        password: '1234',
        nome: 'Mariana Berenguel',
        contato: '11939417996',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'cintia.torre@example.com',
        password: '1234',
        nome: 'Cintia Torre',
        contato: '11999807859',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'nayara.cardoso@example.com',
        password: '1234',
        nome: 'Nayara Cardoso',
        contato: '11916115329',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'emilly.rodrigues@example.com',
        password: '1234',
        nome: 'Emilly Rodrigues',
        contato: '11910330339',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'vitoria.domingues@example.com',
        password: '1234',
        nome: 'Vitoria Domingues',
        contato: '11968439668',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'miriam.araujo@example.com',
        password: '1234',
        nome: 'Miriam de Araujo',
        contato: '11997902808',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
      {
        email: 'vitoria.tenorio@example.com',
        password: '1234',
        nome: 'Vitoria Tenório',
        contato: '11951621162',
        produto: 'EDP',
        unidade: 'MOGI 1',
        matricula: null,
        aniversario: '1999-01-01',
      },
    ];

    const users = await Promise.all(
      listaCreate.map(async (user) => {
        return await this.createT(user);
      }),
    );

    return users;
  }

  async SendComanda() {
    const listaComandas: {
      id: string;
      nome: string;
      comanda:
        | {
            produto: string;
            quantidade: number | string;
            valor: number | string;
          }[]
        | string;
      total: string | number;
    }[] = [
      {
        id: 'cm6syxakv0006pz50rcb7p4mj',
        nome: 'Daniela Caroline',
        total: 'R$ 24,00',
        comanda: [
          {
            produto: 'BRIGADEIRO/BEIJINHO',
            quantidade: 2,
            valor: 'R$ 24,00',
          },
        ],
      },
      {
        id: 'cm6syxalv0007pz506fr6uys3',
        nome: 'Ciara',
        total: 'R$ 72,00',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 2,
            valor: 'R$ 20,00',
          },
          {
            produto: 'BOLO PRESTIGIO',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'COPINHO/TORTINHA',
            quantidade: 2,
            valor: 'R$ 22,00',
          },
          {
            produto: 'TORTINHA MARACUJÁ',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
        ],
      },
      {
        id: 'cm6syxanu0008pz505kzdr3hi',
        nome: 'Isabela Cir',
        comanda: [
          {
            produto: 'COPO FELICIDADE',
            quantidade: 2,
            valor: 24.0,
          },
          {
            produto: 'TORTINHA LIMÃO',
            quantidade: 1,
            valor: 10.0,
          },
        ],
        total: 34.0,
      },

      {
        id: 'cm6syxanw000apz50drnep31n',
        nome: 'Giovanna K.',

        total: 'R$ 138,00',
        comanda: [
          {
            produto: 'BEIJINHO',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
          {
            produto: 'bolo',
            quantidade: 2,
            valor: 'R$ 20,00',
          },
          {
            produto: 'BRIGADEIRO/BOLO',
            quantidade: 3,
            valor: 'R$ 32,00',
          },
          {
            produto: 'SURPRESA DE UVA',
            quantidade: 2,
            valor: 'R$ 24,00',
          },
          {
            produto: 'TORTINHA LIMÃO',
            quantidade: 4,
            valor: 'R$ 40,00',
          },
          {
            produto: 'TORTINHA MOUSSE LIMÃO',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
        ],
      },

      {
        id: 'cm6syxapy000cpz50s8z2hsgg',
        nome: 'Kelly Cristina',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'bolo chocolate',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'BOLO CHOCOLATUDO',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'BOLO PRESTIGIO',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'BRIGADEIRO',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'BRIGADEIRO / copo f.',
            quantidade: 3,
            valor: 36.0,
          },
          {
            produto: 'CAIXINHA DA ALEGRIA',
            quantidade: 2,
            valor: 24.0,
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 3,
            valor: 36.0,
          },
          {
            produto: 'SURPRESA DE UVA',
            quantidade: 2,
            valor: 24.0,
          },
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 2,
            valor: 20.0,
          },
          {
            produto: 'TRUFA LIMÃO',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 204.0,
      },
      {
        id: 'cm6syxapy000dpz50qqndkmov',
        nome: 'Luiz Edu',
        total: 46.0,
        comanda: [
          {
            produto: 'CAIXINHA DA ALEGRIA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'COPO FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'SURPRESA DE UVA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'TORTINHA LIMÃO',
            quantidade: 1,
            valor: 10.0,
          },
        ],
      },
      {
        id: 'cm6syxapz000epz50hdl24hp6',
        nome: 'Jessica Monteiro',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'BOLO PROMOÇÃO',
            quantidade: 1,
            valor: 28.0,
          },
          {
            produto: 'BOMBOM CP MOR',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'BRIGADEIRO OVOMALTINE',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'COPINHO FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'CX MISTA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 2,
            valor: 20.0,
          },
        ],
        total: 106.0,
      },

      {
        id: 'cm6syxat2000hpz50mipjflx7',
        nome: 'Maria Eduarda Barreto',
        total: 380.0,
        comanda: [
          {
            produto: 'BEIJINHO',
            quantidade: 3,
            valor: 36.0,
          },
          {
            produto: 'Bolo',
            quantidade: 8,
            valor: 80.0,
          },
          {
            produto: 'Bolo Chocolate',
            quantidade: 2,
            valor: 20.0,
          },
          {
            produto: 'BOMBOM CP UVA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'BRIGADEIRO',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'BRIGADEIRO/BOLO',
            quantidade: 2,
            valor: 22.0,
          },
          {
            produto: 'CAIXINHA ALEGRIA MISTA',
            quantidade: 2,
            valor: 24.0,
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'COPINHO F./TRUFA',
            quantidade: 2,
            valor: 24.0,
          },
          {
            produto: 'COPO FELICIDADE/SURPRESA',
            quantidade: 2,
            valor: 24.0,
          },
          {
            produto: 'CX MISTA/COPINHO',
            quantidade: 2,
            valor: 24.0,
          },
          {
            produto: 'SURPRESA DE UVA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'TORTINHA',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'TORTINHA LIMÃO',
            quantidade: 2,
            valor: 20.0,
          },
          {
            produto: 'TRUFA',
            quantidade: 4,
            valor: 48.0,
          },
        ],
      },
      {
        id: 'cm6syxav7000lpz50mgow2yuf',
        nome: 'Fabiola Alves',

        total: 'R$ 100,00',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 2,
            valor: 'R$ 20,00',
          },
          {
            produto: 'BOLO PRESTIGIO',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 2,
            valor: 'R$ 24,00',
          },
          {
            produto: 'COPO FELICIDADE',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
          {
            produto: 'SURPRESA DE UVA',
            quantidade: 2,
            valor: 'R$ 24,00',
          },
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
        ],
      },
      {
        id: 'cm6syxaxo000mpz503zvlxyap',
        nome: 'Bia Treinamento',
        comanda: [
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 2,
            valor: 24.0,
          },
          {
            produto: 'SURPRESA DE UVA',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 36.0,
      },
      {
        id: 'cm6syxaxo000npz50hqyabx53',
        nome: 'Fernanda',

        total: 'R$ 164,00',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 3,
            valor: 'R$ 30,00',
          },
          {
            produto: 'BOLO CHOC/PRESTIGIO',
            quantidade: 1,
            valor: 'R$ 28,00',
          },
          {
            produto: 'BRIGADEIRO',
            quantidade: 3,
            valor: 'R$ 36,00',
          },
          {
            produto: 'BRIGADEIRO / copo f.',
            quantidade: 2,
            valor: 'R$ 24,00',
          },
          {
            produto: 'BRIGADEIRO/BOLO',
            quantidade: 2,
            valor: 'R$ 22,00',
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
          {
            produto: 'COPO FELICIDADE',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
        ],
      },
      {
        id: 'cm6syxayp000opz50rjsyt1so',
        nome: 'Grazielly Da Silva',

        total: 'R$ 68,00',
        comanda: [
          {
            produto: 'BOLO/TORTINHA',
            quantidade: 1,
            valor: 'R$ 20,00',
          },
          {
            produto: 'BRIIGADEIRO',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
          {
            produto: 'SURPRESA DE UVA',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
          {
            produto: 'TRUFA',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
        ],
      },

      {
        id: 'cm6syxb1j000qpz50migvjuab',
        nome: 'Lauren Luiza',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'COPO FELICIDADE',
            quantidade: 2,
            valor: 24.0,
          },
        ],
        total: 34.0,
      },
      {
        id: 'cm6syxb1o000rpz501rq9advz',
        nome: 'Karolina Loira',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 7,
            valor: 70.0,
          },
          {
            produto: 'BRIGADEIRO',
            quantidade: 5,
            valor: 60.0,
          },
          {
            produto: 'SURPRESA UVA',
            quantidade: 4,
            valor: 48.0,
          },
          {
            produto: 'CAIXINHA MISTA',
            quantidade: 4,
            valor: 48.0,
          },
          {
            produto: 'TORTINHA ',
            quantidade: 4,
            valor: 40.0,
          },
        ],
        total: 268.0,
      },
      {
        id: 'cm6syxb1o000upz50k2sb7uul',
        nome: 'Ana Karoline Reis',
        comanda: [
          {
            produto: 'SURPRESA DE UVA',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 12.0,
      },
      {
        id: 'cm6syxb1o000vpz50hp1stnl1',
        nome: 'Isabela Rodrigues',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'SURPRESA/CX MISTA',
            quantidade: 2,
            valor: 24.0,
          },
          {
            produto: 'bolo',
            quantidade: 2,
            valor: 20.0,
          },
          {
            produto: 'BRIGADEIRO OVOMALTINE',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'SURPRESA DE UVA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'TORTINHA MARACUJÁ',
            quantidade: 1,
            valor: 10.0,
          },
        ],
        total: 88.0,
      },
      {
        id: 'cm6syxb3m000wpz50czcfbd9p',
        nome: 'Andressa Mt',
        comanda: [
          {
            produto: 'PROMOÇÃO BOLO',
            quantidade: 1,
            valor: 15.0,
          },
          {
            produto: 'TORTINHA MARACUJÁ',
            quantidade: 1,
            valor: 10.0,
          },
        ],
        total: 25.0,
      },
      {
        id: 'cm6syxb4n000zpz50lvh9v8zo',
        nome: 'Ana Vitória Rocha',
        comanda: [
          {
            produto: 'TORTINHA MARACUJÁ',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'TRUFA',
            quantidade: 3,
            valor: 34.0,
          },
        ],
        total: 44.0,
      },
      {
        id: 'cm6syxb5d0010pz501ep2ilda',
        nome: 'Inaue',
        comanda: [
          {
            produto: 'CX BRIGADEIRO',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 12.0,
      },
      {
        id: 'cm6syxb5h0011pz50zhb2bws7',
        nome: 'Evelyn',
        total: 'R$ 24,00',
        comanda: [
          {
            produto: 'COPO FELICIDADE',
            quantidade: 2,
            valor: 'R$ 24,00',
          },
        ],
      },
      {
        id: 'cm6syxb610012pz50da9dr1fw',
        nome: 'Livia Mt',
        comanda: [
          {
            produto: 'COPO FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 12.0,
      },
      {
        id: 'cm6syxb7i0013pz501b0wnyu1',
        nome: 'Camila Matias',
        total: 'R$ 10,00',
        comanda: [
          {
            produto: 'BOLO CHOCOLATUDO',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
        ],
      },
      {
        id: 'cm6syxb8j0014pz500wwp0seu',
        nome: 'Matheus Cachos',
        total: 154.0,
        comanda: [
          {
            produto: 'BEIJINHO',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'Bolo',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'BOLO MARACUJÁ',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'BOLO PRESTIGIO',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 36.0,
          },
          {
            produto: 'SURPRESA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'SURPRESA DE UVA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'TORTINHA',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 1,
            valor: 20.0,
          },
          {
            produto: 'TORTINHAS MOUSSES',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'TRUFA MARACUJÁ',
            quantidade: 1,
            valor: 12.0,
          },
        ],
      },
      {
        id: 'cm6syxb8m0015pz50tj15zqgp',
        nome: 'Maria Eduarda Pereira',
        total: 10.0,
        comanda: [
          {
            produto: 'TORTINHA LIMÃO',
            quantidade: 1,
            valor: 10.0,
          },
        ],
      },

      {
        id: 'cm6syxbb80017pz501klnfes4',
        nome: 'Carolina Lourenco',

        total: 'R$ 20,00',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
        ],
      },

      {
        id: 'cm6syxbf6001cpz50ogvnqxk4',
        nome: 'Adriana Lacombe',
        comanda: [
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'COPINHO F. TRUFA',
            quantidade: 1,
            valor: 24.0,
          },
        ],
        total: 36.0,
      },
      {
        id: 'cm6syxbh2001epz50hagsgb9h',
        nome: 'Andreza Aparecida',
        comanda: [
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 12.0,
      },
      {
        id: 'cm6syxbia001fpz50msaahuem',
        nome: 'Daiane Apolonio',

        total: 'R$ 32,00',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'Surpresa/tortinha mousse',
            quantidade: 1,
            valor: 'R$ 22,00',
          },
        ],
      },
      {
        id: 'cm6syxbir001gpz50h6t53h91',
        nome: 'Daiany Marcella',

        total: 'R$ 101,00',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'bolo Beijinho',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'BOLO PRESTIGIO',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'BOLO PROMOÇÃO',
            quantidade: 1,
            valor: 'R$ 15,00',
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
          {
            produto: 'COPO FELICIDADE',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
          {
            produto: 'TORTINHA MORANGO',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'TRUFA',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
        ],
      },
      {
        id: 'cm6syxbji001hpz505cvjzm6r',
        nome: 'João Vitor Nicacio',
        comanda: [
          {
            produto: 'BOLO/ TORTINHA MORANGO',
            quantidade: 1,
            valor: 28.0,
          },
          {
            produto: 'COPINHO DA F. MARACUJÁ',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'COPINHO F./ 3 TORTINHAS',
            quantidade: 1,
            valor: 48.0,
          },
          {
            produto: 'COPINHO F./TRUFA',
            quantidade: 1,
            valor: 24.0,
          },
          {
            produto: 'TRUFA',
            quantidade: 1,
            valor: 24.0,
          },
        ],
        total: 134.0,
      },
      {
        id: 'cm6syxbji001ipz50lzcl2k8c',
        nome: 'Erik Caique',
        total: 'R$ 206,00',
        comanda: [
          {
            produto: 'BEIJINHO',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
          {
            produto: 'bolo',
            quantidade: 2,
            valor: 'R$ 20,00',
          },
          {
            produto: 'BOLO PROMOÇÃO',
            quantidade: 1,
            valor: 'R$ 28,00',
          },
          {
            produto: 'BRIGADEIRO/TORTINHA',
            quantidade: 1,
            valor: 'R$ 22,00',
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 2,
            valor: 'R$ 48,00',
          },
          {
            produto: 'COPINHOF./CAJU',
            quantidade: 1,
            valor: 'R$ 26,00',
          },
          {
            produto: 'TORTINHA LIMÃO/MARACUJÁ',
            quantidade: 1,
            valor: 'R$ 20,00',
          },
          {
            produto: 'TORTINHAS MOUSSES',
            quantidade: 1,
            valor: 'R$ 30,00',
          },
        ],
      },
      {
        id: 'cm6syxbkx001jpz50m62n94rq',
        nome: 'Joyce Jamily',
        comanda: [
          {
            produto: 'BEIJINHO',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'COPINHO F./ TRUFA',
            quantidade: 1,
            valor: 24.0,
          },
          {
            produto: 'TORTINHA',
            quantidade: 1,
            valor: 10.0,
          },
        ],
        total: 46.0,
      },
      {
        id: 'cm6syxbls001kpz50zqvlvok1',
        nome: 'Karina Pessoa',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 2,
            valor: 20.0,
          },
          {
            produto: 'BRIGADEIRO/TORTINHA',
            quantidade: 1,
            valor: 22.0,
          },
          {
            produto: 'CAIXINHA DA ALEGRIA',
            quantidade: 1,
            valor: 24.0,
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'SURPRESA/BRIGADEIRO',
            quantidade: 1,
            valor: 24.0,
          },
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 2,
            valor: 20.0,
          },
          {
            produto: 'TRUFA',
            quantidade: 1,
            valor: 24.0,
          },
        ],
        total: 146.0,
      },
      {
        id: 'cm6syxbmn001lpz50zazewpmm',
        nome: 'Larissa Dantas',
        comanda: [
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'COPINHO F./BEIJINHO',
            quantidade: 1,
            valor: 24.0,
          },
          {
            produto: 'TORTINHA MORAN/MARAC',
            quantidade: 1,
            valor: 20.0,
          },
          {
            produto: 'TRUFA',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 68.0,
      },
      {
        id: 'cm6syxbnb001mpz506ml9w9c8',
        nome: 'Lavigne',
        comanda: [
          {
            produto: 'BRIGADEIRO',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'BRIGADEIRO/CAJU',
            quantidade: 1,
            valor: 26.0,
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'SURPRESA DE UVA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'TORTINHA LIMÃO',
            quantidade: 1,
            valor: 10.0,
          },
        ],
        total: 72.0,
      },
      {
        id: 'cm6syxbog001npz5040sjp77w',
        nome: 'Dyovanna',
        total: 'R$ 24,00',
        comanda: [
          {
            produto: 'BRIGADEIRO',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
        ],
      },

      {
        id: 'cm6syxbrp001spz50kp66ci9q',
        nome: 'Elisabeth',

        total: 'R$ 12,00',
        comanda: [
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
        ],
      },

      {
        id: 'cm6syxbsu001upz50sg7g6x6x',
        nome: 'Beatriz Talissa',
        comanda: [
          {
            produto: 'BOLO PRESTIGIO',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'BRIGADEIRO',
            quantidade: 2,
            valor: 36.0,
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 2,
            valor: 24.0,
          },
          {
            produto: 'COPINHO F/BRIGADEIRO',
            quantidade: 1,
            valor: 24.0,
          },
          {
            produto: 'TORTINHA LIMÃO',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'TORTINHA MORANGO',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 2,
            valor: 40.0,
          },
        ],
        total: 154.0,
      },
      {
        id: 'cm6syxbu0001vpz50kuia8tf4',
        nome: 'Cauan Dos Santos',

        total: 'R$ 142,00',
        comanda: [
          {
            produto: '1 COPINHO F./ 2 BRIGADEIRO',
            quantidade: 1,
            valor: 'R$ 36,00',
          },
          {
            produto: 'BOLO DE POTE',
            quantidade: 1,
            valor: 'R$ 30,00',
          },
          {
            produto: 'BOLO DE PRESTIGIO',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'CAIXINHA ALEGRIA BEIJINHO',
            quantidade: 1,
            valor: 'R$ 24,00',
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
          {
            produto: 'TORTINHA MARACUJÁ',
            quantidade: 2,
            valor: 'R$ 20,00',
          },
          {
            produto: 'TOTINHA MARACUJÁ',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
        ],
      },
      {
        id: 'cm6syxbu0001wpz504w2vcys9',
        nome: 'Elzir',

        total: 'R$ 112,00',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 'R$ 20,00',
          },
          {
            produto: 'COPINHO F. MARACUJÁ',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'CX MISTA',
            quantidade: 2,
            valor: 'R$ 24,00',
          },
          {
            produto: 'SURPRESA/BEIJINHO',
            quantidade: 1,
            valor: 'R$ 24,00',
          },
          {
            produto: 'TORTINHA MORANGO',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'TRUFA MISTA',
            quantidade: 2,
            valor: 'R$ 24,00',
          },
        ],
      },
      {
        id: 'cm6syxbv2001ypz50cu7bhv6h',
        nome: 'Danilo Lima',
        total: 'R$ 48,00',
        comanda: [
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
          {
            produto: 'TORTINHA DE MORANGO',
            quantidade: 1,
            valor: 'R$ 16,00',
          },
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 1,
            valor: 'R$ 20,00',
          },
        ],
      },
      {
        id: 'cm6syxbx30020pz50gm0mqfys',
        nome: 'Kelly Coordenadora',
        comanda: [
          {
            produto: 'BRIGADEIRO OVOMALTINE',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'COPO FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 34.0,
      },

      {
        id: 'cm6syxc0i0025pz50dhr7zukm',
        nome: 'Erika Vanessa',
        total: 'R$ 36,00',
        comanda: [
          {
            produto: 'BOLO CHOCOLATUDO',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'CAJUZINHO',
            quantidade: 1,
            valor: 'R$ 14,00',
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
        ],
      },

      {
        id: 'cm6syxc4e0029pz50hmsh7wn8',
        nome: 'André Coordenador',
        comanda: [
          {
            produto: 'BRIGADEIRO',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 12.0,
      },
      {
        id: 'cm6syxc4e002apz50m08saamh',
        nome: 'Fatima',
        total: 'R$ 10,00',
        comanda: [
          {
            produto: 'TORTINHA',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
        ],
      },

      {
        id: 'cm6syxc7a002dpz50ixtud2cz',
        nome: 'Gaby Smart',
        total: 'R$ 24,00',
        comanda: [
          {
            produto: 'BRIGADEIRO',
            quantidade: 1,
            valor: 'R$ 24,00',
          },
        ],
      },
      {
        id: 'cm6syxc7e002epz50zlulmloj',
        nome: 'Gabriel Diniz',

        total: 'R$ 10,00',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
        ],
      },

      {
        id: 'cm6syxcb4002jpz50gg9ayt98',
        nome: 'Larissa Fernanda',
        comanda: [
          {
            produto: 'BRIGADEIRO',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 24.0,
      },

      {
        id: 'cm6syxcdd002mpz50howk8rto',
        nome: 'Jefferson C',
        comanda: [
          {
            produto: 'BRIGADEIRO',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 12.0,
      },
      {
        id: 'cm6syxce7002npz5083c0oufc',
        nome: 'Joana',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'BOLO CHOC MARACUJÁ',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'CAIXINHA DA ALEGRIA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'TORTINHA MARACUJÁ',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'TORTINHA MORANGO',
            quantidade: 1,
            valor: 10.0,
          },
        ],
        total: 64.0,
      },
      {
        id: 'cm6syxcfc002opz50el0wjya7',
        nome: 'Inae Barros',
        comanda: [
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 12.0,
      },

      {
        id: 'cm6syxcgh002qpz500yl51a79',
        nome: 'Joyce Cristine',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 20.0,
          },
          {
            produto: 'BRIGADEIRO',
            quantidade: 2,
            valor: 24.0,
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 1,
            valor: 10.0,
          },
        ],
        total: 66.0,
      },

      {
        id: 'cm6syxcis002tpz506h2ysjv9',
        nome: 'Livia Carolina M.',
        comanda: [
          {
            produto: 'BRIGADEIRO',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'BRIGADEIRO OVOMALTINE',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 24.0,
      },
      {
        id: 'cm6syxcjv002upz50996qw5rw',
        nome: 'Leticia Gloria',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'BOLO CHOC MARACUJÁ',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'CAIXINHA DA ALEGRIA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'TORTINHA DE MARACUJA',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'TORTINHA MORANGO',
            quantidade: 1,
            valor: 10.0,
          },
          {
            produto: 'TRUFA',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 64.0,
      },
      {
        id: 'cm6syxcjv002vpz50jhe22ppd',
        nome: 'Beatriz Ribeiro',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 2,
            valor: 20.0,
          },
          {
            produto: 'SURPRESA DE UVA',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 32.0,
      },
      {
        id: 'cm6syxckz002wpz50mc8k1tfb',
        nome: 'Maria Eduarda Silva',
        total: 24.0,
        comanda: [
          {
            produto: 'CAIXINHA ALEGRIA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'COPO FELICIDADE',
            quantidade: 1,
            valor: 12.0,
          },
        ],
      },

      {
        id: 'cm6syxcm7002ypz50fv5kz1yw',
        nome: 'Fabiana',

        total: 'R$ 25,00',
        comanda: [
          {
            produto: 'TORTINHA MOUSSE',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
          {
            produto: 'TORTINHA PROMOÇÃO',
            quantidade: 1,
            valor: 'R$ 15,00',
          },
        ],
      },
      {
        id: 'cm6syxcmc002zpz50y9l0ow3r',
        nome: 'Luana Amil',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 10.0,
          },
        ],
        total: 10.0,
      },
      {
        id: 'cm6syxcok0030pz502ogx8g5n',
        nome: 'Luisa Bezerra',
        comanda: [
          {
            produto: 'BRIGADEIRO',
            quantidade: 1,
            valor: 12.0,
          },
        ],
        total: 12.0,
      },
      {
        id: 'cm6syxcok0031pz509evv7hjp',
        nome: 'Ana Beatriz',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 2,
            valor: 20.0,
          },
          {
            produto: 'BOLO CHOCOLATUDO',
            quantidade: 1,
            valor: 10.0,
          },
        ],
        total: 30.0,
      },
      {
        id: 'cm6syxcp50032pz509f39pvs0',
        nome: 'Bruna Toth',
        total: 'R$ 20,00',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 2,
            valor: 'R$ 20,00',
          },
        ],
      },
      {
        id: 'cm6syxcrf0035pz50xcd4rap4',
        nome: 'Maria Luiza',
        total: 20.0,
        comanda: [
          {
            produto: 'TORTINHAS MOUSSES',
            quantidade: 1,
            valor: 20.0,
          },
        ],
      },

      {
        id: 'cm6syxcv60039pz5095ku2jd3',
        nome: 'Marjo',
        total: 88.0,
        comanda: [
          {
            produto: 'BEIJINHO/TORTINHA',
            quantidade: 1,
            valor: 22.0,
          },
          {
            produto: 'Bolo',
            quantidade: 1,
            valor: 20.0,
          },
          {
            produto: 'CAIXINHA DA ALEGRIA',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'COPINHO DA FELICIDADE',
            quantidade: 1,

            valor: 22.0,
          },
          {
            produto: 'TRUFA',
            quantidade: 1,
            valor: 12.0,
          },
        ],
      },
      {
        id: 'cm6syxcv7003apz50uv63kham',
        nome: 'Hellryn Janis',
        comanda: [
          {
            produto: 'BEIJINHO',
            quantidade: 1,
            valor: 12.0,
          },
          {
            produto: 'bolo',
            quantidade: 3,
            valor: 30.0,
          },
        ],
        total: 42.0,
      },

      {
        id: 'cm6syxd2z003lpz50ma1iqr88',
        nome: 'Debora',

        total: 'R$ 10,00',
        comanda: [
          {
            produto: 'bolo',
            quantidade: 1,
            valor: 'R$ 10,00',
          },
        ],
      },
      {
        id: 'cm6syxd3i003mpz50wcl94eua',
        nome: 'Mariana Berenguel',
        total: 20.0,
        comanda: [
          {
            produto: 'Bolo',
            quantidade: 2,
            valor: 20.0,
          },
        ],
      },
      {
        id: 'cm6syxd3k003npz50ck84d26n',
        nome: 'Cintia Torre',

        total: 'R$ 12,00',
        comanda: [
          {
            produto: 'BRIGADEIRO',
            quantidade: 1,
            valor: 'R$ 12,00',
          },
        ],
      },

      {
        id: 'cm6syxd5k003ppz50tzdq694i',
        nome: 'Emilly Rodrigues',
        total: 'R$ 24,00',
        comanda: [
          {
            produto: 'CAIXINHA DA ALEGRIA',
            quantidade: 1,
            valor: 'R$ 24,00',
          },
        ],
      },
    ];

    for (const user of listaComandas) {
      const u = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          MessageLog: true,
        },
      });

      const formatarPedidos = (comanda) => {
        if (!Array.isArray(comanda)) return comanda;
        return comanda
          .map(
            (item) =>
              `- ${item.produto} (QTD: ${item.quantidade}, R$ ${item.valor})`,
          )
          .join('\n');
      };

      const mensagem = `Olá, ${u.nome} 🥰🥰\n\nEstamos entrando em contato para agradecer pela sua compra!! 😁💝\n\nA respeito do pagamento, fique tranquilo(a), sua comanda foi aberta e todos seus pedidos serão contabilizados!\n\n${formatarPedidos(user.comanda)}\n\n*TOTAL: R$ ${user.total}*\n*Nosso pix: 11999241855*\n*Karinna Mattoso - Nubank*\n\nDocinhos Tia Lulu agradece sua preferência!`;

      axios.defaults.headers.post['Content-Type'] = 'application/json';

      await axios
        .post('http://localhost:3010/send/', {
          message: mensagem,
          numero: u.contato,
        })
        .then(async (res) => {
          console.log('deu certo');

          const msgLog = await this.prisma.messageLog.create({
            data: {
              message: true,
              userId: u.id,
            },
          });

          await this.prisma.user.update({
            where: { id: u.id },
            data: {
              messageLogId: Number(msgLog.id),
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });

      await this.delay(1 * 60 * 1000);
    }
  }
}
