import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
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

  @ApiOperation({ summary: 'Retrieve all clients' })
  @ApiResponse({ status: 200, description: 'List of all clients.', type: [Client] })
  @Get()
  async findAll(): Promise<Client[]> {
    return await this.clientsService.findAll();
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
