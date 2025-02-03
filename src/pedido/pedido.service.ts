import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CrmService } from 'src/crm.service';
import { PrismaService } from 'src/config/prisma.client';
import { Pedido } from '@prisma/client';
import { CreateItemPedidoDto } from './dto/create-itemPedido.dto';

@Injectable()
export class PedidoService {
  constructor(
    private crm: CrmService,
    private prisma: PrismaService,
  ) {}

  async create({
    itens_id,
    user_id,
    status,
    metodo_pagamento,
    total,
  }: CreatePedidoDto): Promise<Pedido> {
    await this.crm.findUserById(user_id);

    for (const item of itens_id) {
      await this.crm.findItemById(item.id);
    }

    return await this.prisma.pedido.create({
      data: {
        userId: user_id,
        status: status,
        metodo_pagamento: metodo_pagamento,
        total: total,
        pedidoitem: {
          create: itens_id.map((item) => ({
            cardapioId: item.id,
            quantidade: item.qtd,
            valor_unitario: item.valor_unitario,
          })),
        },
      },
      include: {
        pedidoitem: true,
      },
    });
  }

  async findAll(): Promise<Pedido[]> {
    return await this.prisma.pedido.findMany({});
  }

  async findOne(id: number): Promise<Pedido> {
    await this.crm.findPedidoById(Number(id));

    return await this.prisma.pedido.findUnique({
      where: { id: Number(id) },
    });
  }

  async remove(id: number): Promise<Pedido> {
    await this.crm.findPedidoById(Number(id));

    return await this.prisma.pedido.delete({
      where: { id: Number(id) },
    });
  }

  async update(
    id: number,
    { itens_id, status, user_id }: UpdatePedidoDto,
  ): Promise<Pedido> {
    await this.crm.findUserById(user_id);

    return await this.prisma.pedido.update({
      where: { id: Number(id) },
      data: {
        status: status,
        userId: user_id,
      },
      include: {
        user: true,
      },
    });
  }
}
