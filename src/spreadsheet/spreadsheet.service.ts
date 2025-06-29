import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ClienteComandaDto } from './dto/clienteComanda.dto';
import { CreatePedidoDto } from 'src/pedido/dto/create-pedido.dto';
import { CrmService } from 'src/crm.service';
import { PedidoService } from 'src/pedido/pedido.service';
import { PrismaService } from 'src/config/prisma.client';

@Injectable()
export class SpreadsheetService {
  constructor(
    private userServie: UserService,
    private crmService: CrmService,
    private pedidoService: PedidoService,
    private prisma: PrismaService,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('Arquivo não enviado ou inválido!');
    }

    const comandas: ClienteComandaDto[] = JSON.parse(
      file.buffer.toString('utf-8'),
    );

    if (!Array.isArray(comandas) || comandas.length === 0) {
      throw new ConflictException('Conflito: arquivo vazio!');
    }

    const erros: string[] = [];

    for (const cliente of comandas) {
      const email = this.crmService.gerarEmail(cliente.nome);

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      const userId = existingUser
        ? existingUser.id
        : (
            await this.userServie.create({
              email,
              password: 'mudar123',
              confirmPassword: 'mudar123',
              nome: cliente.nome,
              contato: cliente.telefone,
              produto: cliente.vendedor === 'GUILHERME' ? 'ALELO' : 'EPD',
              unidade: cliente.vendedor === 'GUILHERME' ? 'MOGI 1' : 'MOGI 2',
              matricula: cliente.telefone,
              aniversario: '01/01/2025',
              celula: cliente.celula || 'NÃO INFORMADO',
              operacao: cliente.operacao || 'NÃO INFORMADO',
            })
          ).id;

      for (const item of cliente.pedidos) {
        if (!item.id_produto) {
          erros.push(
            `Produto sem ID para cliente ${cliente.nome}: ${JSON.stringify(item)}`,
          );
          continue;
        }

        const i = await this.crmService.findItemById(item.id_produto);

        if (!i) {
          erros.push(
            `Produto não encontrado com ID ${item.id_produto} para cliente ${cliente.nome}`,
          );
          continue;
        }

        const createPedido: CreatePedidoDto = {
          user_id: userId,
          status: 'PENDENTE',
          metodo_pagamento: 'PIX',
          total: item.total,
          data: item.data,
          itens_id: [
            {
              id: i.id,
              quantidade: item.quantidade,
              preco: item.total,
              active: true,
              descricao: i.descricao,
              titulo: i.titulo,
              urlFoto: i.urlFoto,
            },
          ],
        };

        await this.pedidoService.create(createPedido);
      }
    }

    if (erros.length) {
      throw new BadRequestException(erros.join('; '));
    }

    return {
      message: 'Upload processado com sucesso!',
      totalClientes: comandas.length,
    };
  }
}
