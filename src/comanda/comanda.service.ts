import { Injectable } from '@nestjs/common';
import { UpdateComandaDto } from './dto/update-comanda.dto';
import { PrismaService } from 'src/config/prisma.client';
import { CrmService } from 'src/crm.service';
import { UserService } from 'src/user/user.service';
import { PedidoService } from 'src/pedido/pedido.service';
import { Comanda } from '@prisma/client';
import { log } from 'console';

@Injectable()
export class ComandaService {
  constructor(
    private prisma: PrismaService,
    private crm: CrmService,
    private userService: UserService,
    private pedidoService: PedidoService,
  ) {}

  async create() {
    const users = await this.userService.findAll();
    const pedidos = await this.pedidoService.findAll();
    const createdComandas = [];

    console.log(users);
    console.log(pedidos);

    for (const user of users) {
      // Filtra apenas os pedidos pendentes do usuário atual
      const pedidosPendentes = pedidos.filter(
        (p) => p.userId === user.id && p.status === 'PENDENTE',
      );

      if (pedidosPendentes.length === 0) {
        continue;
      }

      // Soma o total de todos os pedidos pendentes do usuário
      const total = pedidosPendentes.reduce(
        (acc, pedido) => acc + pedido.total,
        0,
      );

      // Pega o vendedor do primeiro pedido pendente
      const vendedor = pedidosPendentes[0].vendedor || 'VENDEDOR';

      // Cria a comanda no banco
      const createComanda = await this.prisma.comanda.create({
        data: {
          nome_cliente: user.nome ?? 'CLIENTE SEM NOME',
          total,
          saldo_quitado: 0,
          saldo_pendente: 0,
          status: 'PENDENTE',
          vendedor,
          Pedidos: {
            connect: pedidosPendentes.map((pedido) => ({ id: pedido.id })),
          },
          user: {
            connect: { id: user.id },
          },
        },
      });

      createdComandas.push(createComanda);
    }

    return createdComandas;
  }

  async findAll() {
    return await this.prisma.comanda.findMany({
      include: {
        Pedidos: {
          include: {
            pedidoitem: {
              include: {
                cardapio: true,
              },
            },
          },
        },
        user: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.crm.findComandaById(id);
  }

  async update(
    id: number,
    updateComandaDto: UpdateComandaDto,
  ): Promise<Comanda> {
    const comandaAtual = await this.crm.findComandaById(id);

    let novoTotal = comandaAtual.total;

    // Remoção de pedidos
    if (updateComandaDto.pedidoIdRemoved) {
      for (const pedidoId of updateComandaDto.pedidoIdRemoved) {
        const pedidoAtual = await this.crm.findPedidoById(pedidoId);

        novoTotal -= pedidoAtual.total;

        await this.prisma.comanda.update({
          where: { id: Number(id) },
          data: {
            Pedidos: {
              disconnect: { id: Number(pedidoId) },
            },
          },
        });

        await this.pedidoService.remove(pedidoId);
      }
    }

    // Edição de pedidos
    if (updateComandaDto.pedidoEdit) {
      for (const pedido of updateComandaDto.pedidoEdit) {
        const pedidoOriginal = await this.crm.findPedidoById(pedido.id_pedido);
        novoTotal -= pedidoOriginal.total;

        await this.pedidoService.update(pedido.id_pedido, pedido);

        novoTotal += pedido.total;
      }
    }

    // Monta o objeto de atualização final
    const dataToUpdate: any = {
      total: novoTotal,
    };

    if (updateComandaDto.status !== undefined)
      dataToUpdate.status = updateComandaDto.status;
    if (updateComandaDto.saldo_pendente !== undefined)
      dataToUpdate.saldo_pendente = updateComandaDto.saldo_pendente;
    if (updateComandaDto.saldo_quitado !== undefined)
      dataToUpdate.saldo_quitado = updateComandaDto.saldo_quitado;
    if (updateComandaDto.total !== undefined)
      dataToUpdate.total = updateComandaDto.total; // cuidado com sobrescrever o `novoTotal`

    const comandaUpdated = await this.prisma.comanda.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    return comandaUpdated;
  }

  remove(id: number) {
    return `This action removes a #${id} comanda`;
  }

  async removeAll() {
    try {
      const pedidoItemN = (await this.prisma.pedidoitem.deleteMany()).count;
      const pedidoN = (await this.prisma.pedido.deleteMany()).count;
      const comandaN = (await this.prisma.comanda.deleteMany()).count;

      return `${comandaN} comandas excluidas. \n ${pedidoN} pedidos excluidos. \n ${pedidoItemN} items excluidos. `;
    } catch (e) {
      console.log(e);
    }
  }
}
