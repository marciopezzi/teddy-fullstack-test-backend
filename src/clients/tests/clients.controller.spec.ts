import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from '../clients.controller';
import { ClientsService } from '../clients.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { Client } from '../entities/client.entity';
import { UpdateClientDto } from '../dto/update-client.dto';


describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findAllPaginated: jest.fn(),
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
      const createClientDto: CreateClientDto = { name: 'Eduardo', salary: 3500, companyValue: 120000 };
      const createdClient: Client = { id: 1, ...createClientDto, createdAt: new Date(), updatedAt: new Date() };

      jest.spyOn(service, 'create').mockResolvedValue(createdClient);

      const result = await controller.create(createClientDto);

      expect(service.create).toHaveBeenCalledWith(createClientDto);
      expect(result).toEqual(createdClient);
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated, filtered, and sorted results', async () => {
      const paginatedResult = {
        data: [
          { id: 1, name: 'Eduardo', salary: 3500, companyValue: 120000, createdAt: new Date(), updatedAt: new Date() },
          { id: 2, name: 'Maria', salary: 4000, companyValue: 150000, createdAt: new Date(), updatedAt: new Date() },
        ],
        total: 2,
      };

      jest.spyOn(service, 'findAllPaginated').mockResolvedValue(paginatedResult);

      const page = '1';
      const limit = '10';
      const sort = 'name';
      const order = 'ASC';
      const filterName = 'Eduardo';

      const result = await controller.findAllPaginated(page, limit, sort, order, filterName);

      expect(service.findAllPaginated).toHaveBeenCalledWith(parseInt(page), parseInt(limit), sort, order, filterName);
      expect(result).toEqual(paginatedResult);
    });
  });


  describe('findOne', () => {
    it('should call ClientsService.findOne with correct ID and return a client', async () => {
      const client: Client = {
        id: 1,
        name: 'Eduardo',
        salary: 3500,
        companyValue: 120000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(client);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(client);
    });
  });

  describe('update', () => {
    it('should call ClientsService.update with correct ID and data', async () => {
      const updateClientDto: UpdateClientDto = { name: 'Eduardo Atualizado', salary: 4000, companyValue: 130000 };
      const updatedClient: Client = {
        id: 1,
        name: 'Eduardo Atualizado',
        salary: 4000,
        companyValue: 130000,
        updatedAt: new Date(),
        createdAt: new Date()
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedClient);

      const result = await controller.update(1, updateClientDto);

      expect(service.update).toHaveBeenCalledWith(1, updateClientDto);
      expect(result).toEqual(updatedClient);
    });
  });

  describe('remove', () => {
    it('should call ClientsService.remove with correct ID', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
