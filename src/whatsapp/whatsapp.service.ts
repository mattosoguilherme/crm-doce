import { Injectable } from '@nestjs/common';
import { SendMessage } from './dto/sendMessage';
import axios from 'axios';
import { ComandaService } from 'src/comanda/comanda.service';
import { log } from 'console';
import { PrismaService } from 'src/config/prisma.client';
import { axiosConfig } from 'src/config/axios.client';

@Injectable()
export class WhatsappService {
  constructor(
    private comandaService: ComandaService,
    private prisma: PrismaService,
  ) {}

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendOne(send: SendMessage) {
    const { id_comanda, msg, telefone } = send;

    try {
      const response = await axios.post(
        'http://localhost:3004/sendToOne',
        {
          telefone: telefone,
          msg: msg,
          id_comanda: Number(id_comanda),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return 'enviado com sucesso' + response;
    } catch (error) {
      console.error(
        'Erro ao enviar mensagem:',
        error.response?.data || error.message,
      );
      throw new Error('Erro ao enviar mensagem');
    }
  }

  async sendAllComandas() {
    const comandas = (await this.comandaService.findAll()).filter(
      (comanda) => comanda.status === 'PENDENTE',
    );

    for (const comanda of comandas) {
      const msg = `
      🌟 Olá! Sou a Maju, assistente da loja. 😊  
    
      👤 *${comanda.user.nome.trim()}*, \n espero que esteja bem!  
      Me perdoe pelo horário, mas estou passando para lembrar sobre o pagamento da sua *COMANDA DE JUNHO*.  

      📲 *Fique por dentro das novidades e promoções!*  
      👉 Siga a gente no Instagram: [@docinhostialulu_](https://www.instagram.com/docinhostialulu_?igsh=MW1tNDNjODdqeXp3Mg==) 🍭✨  
      👉 Entre no nosso grupo do WhatsApp e receba ofertas exclusivas: [Clique aqui](https://chat.whatsapp.com/BvgnLYXjYaR8ek68dMeGvK) 💬🎁  
    
      📋 *COMANDA DE PEDIDO* 📋  
    
      📦 *Pedidos:*  
      ${comanda.Pedidos.map(
        (p) =>
          `➡️ ${p.pedidoitem[0].quantidade}x ${p.pedidoitem[0].cardapio.titulo} - R$ ${p.pedidoitem[0].valor_unitario}`,
      ).join('\n')}  
    
      💰 *Total: R$ ${comanda.total}*  
    
      🔹 Para facilitar, você pode fazer o pagamento via *Pix*:  
      💳 *Chave Pix (Nubank): 11999241855*  
    
      📩 Assim que realizar o pagamento ou se já realizou, por gentileza, envie o comprovante para confirmação.  
    
      Obrigado pela preferência! Qualquer dúvida, estou por aqui. 😊🍬  
  
    `;

      const objSend: SendMessage = {
        telefone: comanda.user.contato,
        msg: msg,
        id_comanda: comanda.id,
      };

      await axios
        .post('http://localhost:3004/sendToOne', objSend, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(async (response) => {
          log('Mensagem enviada com sucesso:', response.data);

          await this.prisma.messageLog.create({
            data: {
              message: true,
              User: { connect: { id: comanda.user.id } },
            },
          });
        })
        .catch((error) => {
          log(
            'Erro ao enviar mensagem:',
            error.response?.data || error.message,
          );
        });

      await this.sleep(60000); // 1 minuto de espera entre os envios
    }
  }

  async sendNoticeAll() {
    const users = await this.prisma.user.findMany();

    for (const user of users) {
      const msg = `Oiê! Maju por aqui de novo rs, sua assistente virtual mais açucarada💜\n\nPedimos desculpas pelo horário!\n

🚨  COMANDA DE JUlHO ATUALIZADA NA PALMA DA SUA MÃO! 

Agradecemos imensamente a compreensão, acesso ao site normalizado!\nSegue login com a *senha atualizada*:
👉 Acesse: https://docetialulu.vercel.app/  
Seu login: *${user.email}*  
Senha padrão: *mudar@123*

Qualquer problema ou dúvida, conte com a gente! 💬`;

      const objSend: SendMessage = {
        telefone: user.contato,
        msg: msg,
        id_comanda: 1,
      };

      await axios
        .post('http://localhost:3004/sendToOne', objSend, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          log('Mensagem enviada com sucesso:', response.data);
        })
        .catch((error) => {
          log(
            'Erro ao enviar mensagem:',
            error.response?.data || error.message,
          );
        });

      await this.sleep(30000);
    }
  }
}
