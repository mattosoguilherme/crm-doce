import {
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

@Injectable()
export class SpreadsheetService {
  constructor(
    private userServie: UserService,
    private crmService: CrmService,
    private pedidoService: PedidoService,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const comandas: ClienteComandaDto[] = JSON.parse(
      file.buffer.toString('utf-8'),
    );

    if (!Array.isArray(comandas) || comandas.length === 0) {
      throw new ConflictException('Conflito: arquivo vaio!');
    }

    for (const cliente of comandas) {
      const creationCliente: CreateUserDto = {
        email: cliente.nome.toLowerCase().replace(/\s+/g, '') + '@docinhos.com',
        password: cliente.telefone,
        confirmPassword: cliente.telefone,
        nome: cliente.nome,
        contato: cliente.telefone,
        produto: cliente.vendedor == 'GUILHERME' ? 'ALELO' : 'EPD',
        unidade: cliente.vendedor == 'GUILHERME' ? 'MOGI 1' : 'MOGI 2',
        matricula: cliente.telefone,
        aniversario: '01/01/2025',
      };

      const { id } = await this.userServie.create(creationCliente);

      for (const item of cliente.pedidos) {
        if (!item.id_produto) {
          throw new NotFoundException(
            `Produto sem ID fornecido: ${JSON.stringify(item)}`,
          );
        }

        const i = await this.crmService.findItemById(item.id_produto);

        const createPedido: CreatePedidoDto = {
          user_id: id,
          status: 'PENDENTE',
          metodo_pagamento: 'PIX',
          total: item.total,
          data: item.data,
          itens_id: [
            {
              id: i.id,
              quantidade: item.quantidade,
              preco: i.preco,
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
  }
}
