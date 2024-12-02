import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { Counter, Histogram } from 'prom-client';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  private readonly requestCounter: Counter<string>;
  private readonly requestDuration: Histogram<string>;

  constructor(private readonly clientsService: ClientsService) {
    this.requestCounter = new Counter({
      name: 'clients_requests_total',
      help: 'Volume de requisições recebidas no endpoint /clients',
      labelNames: ['method', 'route', 'status'],
    });

    this.requestDuration = new Histogram({
      name: 'clients_request_duration_seconds',
      help: 'Demora das requisições no endpoint /clients',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.5, 1, 2.5, 5],
    });
  }

  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully.', type: Client })
  @Post()
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    const start = Date.now();
    try {
      const result = await this.clientsService.create(createClientDto);
      this.requestCounter.inc({ method: 'POST', route: '/clients', status: 201 });
      return result;
    } catch (error) {
      this.requestCounter.inc({ method: 'POST', route: '/clients', status: 400 });
      throw error;
    } finally {
      const duration = (Date.now() - start) / 1000;
      this.requestDuration.observe({ method: 'POST', route: '/clients', status: '201' }, duration);
    }
  }

  @ApiOperation({ summary: 'Retrieve all clients (paginated, filterable, and sortable)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of clients with filtering and sorting.',
    schema: {
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/Client' } },
        total: { type: 'number' },
      },
    },
  })
  @ApiQuery({ name: 'page', type: String, required: true, example: '1', description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', type: String, required: true, example: '8', description: 'Number of items per page' })
  @ApiQuery({ name: 'sort', type: String, required: false, example: 'createdAt', description: 'Field to sort by' })
  @ApiQuery({ name: 'order', enum: ['DESC', 'ASC'], required: true, description: 'Sort order' })
  @ApiQuery({ name: 'filterName', type: String, required: false, description: 'Filter by client name' })
  @Get('paginated')
  async findAllPaginated(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sort') sort: string = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Query('filterName') filterName?: string,
  ): Promise<{ data: Client[]; total: number }> {
    const start = Date.now();
    try {
      const result = await this.clientsService.findAllPaginated(
        parseInt(page, 10),
        parseInt(limit, 10),
        sort,
        order,
        filterName,
      );
      this.requestCounter.inc({ method: 'GET', route: '/clients/paginated', status: 200 });
      return result;
    } finally {
      const duration = (Date.now() - start) / 1000;
      this.requestDuration.observe({ method: 'GET', route: '/clients/paginated', status: '200' }, duration);
    }
  }

  @ApiOperation({ summary: 'Retrieve a client by ID' })
  @ApiResponse({ status: 200, description: 'Client found.', type: Client })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Client> {
    return await this.clientsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a client by ID' })
  @ApiResponse({ status: 200, description: 'Client updated successfully.', type: Client })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return await this.clientsService.update(id, updateClientDto);
  }

  @ApiOperation({ summary: 'Delete a client by ID' })
  @ApiResponse({ status: 204, description: 'Client deleted successfully.' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.clientsService.remove(id);
  }
}
