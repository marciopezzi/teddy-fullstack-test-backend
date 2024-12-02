import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Histogram } from 'prom-client';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);
  private readonly dbQueryDuration: Histogram<string>;

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {
    this.dbQueryDuration = new Histogram({
      name: 'clients_db_query_duration_seconds',
      help: 'Duração de operações no banco de dados relacionadas a clients',
      labelNames: ['operation'],
      buckets: [0.01, 0.1, 0.5, 1, 2],
    });
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const start = Date.now();
    try {
      const client = this.clientRepository.create(createClientDto);
      const result = await this.clientRepository.save(client);
      return result;
    } catch (error) {
      throw new BadRequestException('Failed to create client.');
    } finally {
      const duration = (Date.now() - start) / 1000;
      this.dbQueryDuration.observe({ operation: 'create' }, duration);
    }
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
    filterName?: string,
  ) {
    const start = Date.now();
    try {
      const skip = (page - 1) * limit;
      const queryBuilder = this.clientRepository.createQueryBuilder('client');

      if (filterName) {
        queryBuilder.andWhere('client.name ILIKE :filterName', { filterName: `%${filterName}%` });
      }

      queryBuilder.orderBy(`client.${sort}`, order).skip(skip).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total };
    } finally {
      const duration = (Date.now() - start) / 1000;
      this.dbQueryDuration.observe({ operation: 'findAllPaginated' }, duration);
    }
  }


  async findOne(id: number): Promise<Client> {
    this.logger.log(`Fetching client with id: ${id}`);
    const client = await this.clientRepository.findOneBy({ id });

    if (!client) {
      this.logger.warn(`Client with id ${id} not found`);
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    this.logger.log(`Updating client with id ${id}: ${JSON.stringify(updateClientDto)}`);

    const client = await this.findOne(id);

    try {
      await this.clientRepository.update(id, updateClientDto);
      return { ...client, ...updateClientDto };
    } catch (error) {
      this.logger.error(`Failed to update client: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to update client. Please check the input.');
    }
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing client with id: ${id}`);

    const client = await this.findOne(id);

    try {
      await this.clientRepository.delete(client.id);
    } catch (error) {
      this.logger.error(`Failed to remove client: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to remove client. Please try again later.');
    }
  }
}
