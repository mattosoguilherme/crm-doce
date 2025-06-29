import { Controller, Post, Body} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { SendMessage } from './dto/sendMessage';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  create(@Body() SendMessage: SendMessage) {
    return this.whatsappService.sendOne(SendMessage);
  }

  @Post('sendAllComandas')
 async sendAllComandas() {
    return await this.whatsappService.sendAllComandas();
  }

}
