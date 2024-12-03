import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from '../clients.controller';
import { ClientsService } from '../clients.service';
import { register } from 'prom-client';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(async () => {
    register.clear();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: {
            create: jest.fn(),
            findAllPaginated: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call ClientsService.create with correct data', async () => {
      const createDto: CreateClientDto = {
        name: 'Eduardo',
        salary: 3500,
        companyValue: 120000,
      };
      jest.spyOn(service, 'create').mockResolvedValue(createDto as any);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(createDto);
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated, filtered, and sorted results', async () => {
      const paginatedResult = { data: [], total: 0 };
      jest.spyOn(service, 'findAllPaginated').mockResolvedValue(paginatedResult);

      const result = await controller.findAllPaginated('1', '10', 'name', 'ASC', 'filter');

      expect(service.findAllPaginated).toHaveBeenCalledWith(1, 10, 'name', 'ASC', 'filter');
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findOne', () => {
    it('should call ClientsService.findOne with correct ID and return a client', async () => {
      const client = { id: 1, name: 'Eduardo', salary: 3500, companyValue: 120000 };
      jest.spyOn(service, 'findOne').mockResolvedValue(client as any);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(client);
    });
  });

  describe('update', () => {
    it('should call ClientsService.update with correct ID and data', async () => {
      const updateDto: UpdateClientDto = {
        name: 'Eduardo Atualizado',
        salary: 4000,
      };
      const updatedClient = { id: 1, ...updateDto, companyValue: 120000 };
      jest.spyOn(service, 'update').mockResolvedValue(updatedClient as any);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedClient);
    });
  });

  describe('remove', () => {
    it('should call ClientsService.remove with correct ID', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
