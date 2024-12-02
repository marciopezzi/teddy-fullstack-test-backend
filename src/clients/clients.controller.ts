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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully.', type: Client })
  @Post()
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return await this.clientsService.create(createClientDto);
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
  @Get('paginated')
  async findAllPaginated(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sort') sort: string = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Query('filterName') filterName?: string,
  ): Promise<{ data: Client[]; total: number }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    return this.clientsService.findAllPaginated(pageNumber, limitNumber, sort, order, filterName);
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
