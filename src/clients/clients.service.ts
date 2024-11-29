import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  create(dto: CreateClientDto): Promise<Client> | null {
    return null;
  }

  findAll(): Promise<Client[]> {
    return null;
  }

  findOne(id: number): Promise<Client> | null {
    return null;
  }

  update(id: number, dto: UpdateClientDto): Promise<Client> | null {
    return null;
  }

  remove(id: number): Promise<void> {
    return null;
  }
}
