import { Injectable } from '@nestjs/common';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { UpdateComandaDto } from './dto/update-comanda.dto';
import { PrismaService } from 'src/config/prisma.client';
import { CrmService } from 'src/crm.service';
import { UserService } from 'src/user/user.service';
import { PedidoService } from 'src/pedido/pedido.service';

@Injectable()
export class ComandaService {
  constructor(
    private prisma: PrismaService,
    private crm: CrmService,
    private userService: UserService,
    private pedidoService: PedidoService,
  ) {}

  async create(createComandaDto: CreateComandaDto) {
    const users = await this.userService.findAll();
    const pedidos = await this.pedidoService.findAll();
    const createdComandas = [];

    for (const user of users) {
      let total = 0;
      const comanda = pedidos.filter((p) => p.userId === user.id);
      for (const c of comanda) {
        total += c.total;
      }

     const createComanda = await this.prisma.comanda.create({
        data: {
          nome_cliente: user.nome,
          total: total,
          saldo_quitado: 0,
          saldo_pendente: 0,
          status: 'PENDENTE',
          Pedidos: { connect: comanda.map((c) => ({ id: c.id })) },
          user: { connect: { id: user.id } },
        },
      });

      createdComandas.push(createComanda)
    }

    return createdComandas;
  }

  findAll() {
    return `This action returns all comanda`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comanda`;
  }

  update(id: number, updateComandaDto: UpdateComandaDto) {
    return `This action updates a #${id} comanda`;
  }

  remove(id: number) {
    return `This action removes a #${id} comanda`;
  }
}
