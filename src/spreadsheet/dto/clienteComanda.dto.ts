export class ClienteComandaDto {
  //   {
  //     "nome": "TAUAN",
  //     "telefone": "11945347604",
  //     "vendedor": "GUILHERME",
  //     "sended": false,
  //     "pedidos": [
  //         {
  //             "quantidade": 1,
  //             "produto": "CX DOCE",
  //             "total": 12.0,
  //             "data": "11/04/2025"
  //         }
  //     ],
  //     "total_comanda": 12.0
  // },

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
}
