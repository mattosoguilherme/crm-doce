export class ClienteComandaDto {

  nome: string;
  telefone: string;
  vendedor: string;
  sended: boolean;
  pedidos: [
    {
      quantidade: number;
      produto: string;
      id_produto: number;
      total: number;
      data: string;
    },
  ];
  total_comanda: number;
  celula?: string;
  operacao?: string;
  status?: string;
}
