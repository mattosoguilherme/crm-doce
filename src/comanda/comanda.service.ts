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
  const createdOrUpdatedComandas = [];

  for (const user of users) {
    // Filtra pedidos pendentes do usuário
    const pedidosPendentes = pedidos.filter(
      (p) => p.userId === user.id && p.status === 'PENDENTE',
    );

    if (pedidosPendentes.length === 0) continue;

    // Verifica se o usuário já tem uma comanda pendente
    const comandaExistente = await this.prisma.comanda.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        Pedidos: true,
      },
    });

    if (!comandaExistente) {
      // Se não existe, cria nova comanda
      const total = pedidosPendentes.reduce((acc, pedido) => acc + pedido.total, 0);
      const vendedor = pedidosPendentes[0].vendedor || 'VENDEDOR';

      const novaComanda = await this.prisma.comanda.create({
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

      createdOrUpdatedComandas.push(novaComanda);
    } else {
      // Se já existe, conecta os pedidos ainda não associados
      const idsPedidosExistentes = comandaExistente.Pedidos.map((p) => p.id);

      const novosPedidos = pedidosPendentes.filter(
        (p) => !idsPedidosExistentes.includes(p.id)
      );

      if (novosPedidos.length === 0) continue;

      // Atualiza a comanda conectando os novos pedidos
      const totalAdicional = novosPedidos.reduce((acc, pedido) => acc + pedido.total, 0);
      const comandaAtualizada = await this.prisma.comanda.update({
        where: { id: comandaExistente.id },
        data: {
          total: { increment: totalAdicional },
          Pedidos: {
            connect: novosPedidos.map((pedido) => ({ id: pedido.id })),
          },
        },
      });

      createdOrUpdatedComandas.push(comandaAtualizada);
    }
  }

  return createdOrUpdatedComandas;
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

   async removeAllByStatus(status: string) {
    try {

      const comandaN = (await this.prisma.comanda.deleteMany({
        where: { status },
      })).count;

      return `${comandaN} comandas excluidas. `;
    } catch (e) {
      console.log(e);
    }
  }
}
