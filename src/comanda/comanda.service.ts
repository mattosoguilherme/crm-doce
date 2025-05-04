import { Injectable } from '@nestjs/common';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { UpdateComandaDto } from './dto/update-comanda.dto';

@Injectable()
export class ComandaService {
  create(createComandaDto: CreateComandaDto) {
    return 'This action adds a new comanda';
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
