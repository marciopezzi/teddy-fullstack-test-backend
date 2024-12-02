import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) { }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    this.logger.log(`Creating client: ${JSON.stringify(createClientDto)}`);
    const client = this.clientRepository.create(createClientDto);

    try {
      return await this.clientRepository.save(client);
    } catch (error) {
      this.logger.error(`Failed to create client: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create client. Please check the input.');
    }
  }

  async findAll(): Promise<Client[]> {
    this.logger.log('Fetching all clients');
    return this.clientRepository.find();
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
    filterName?: string,
  ) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.clientRepository.createQueryBuilder('client');

    if (filterName) {
      queryBuilder.andWhere('client.name ILIKE :filterName', { filterName: `%${filterName}%` });
    }

    queryBuilder.orderBy(`client.${sort}`, order);

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
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
