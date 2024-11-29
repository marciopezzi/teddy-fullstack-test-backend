import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../clients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from '../dto/create-client.dto';

describe('ClientsService', () => {
  let service: ClientsService;
  let repository: jest.Mocked<Repository<Client>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repository = module.get(getRepositoryToken(Client));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const createClientDto: CreateClientDto = { name: 'Eduardo', salary: 3500, companyValue: 120000 };
      const savedClient: Client = { id: 1, ...createClientDto };

      repository.create.mockReturnValue(savedClient);
      repository.save.mockResolvedValue(savedClient);

      const result = await service.create(createClientDto);

      expect(repository.create).toHaveBeenCalledWith(createClientDto);
      expect(repository.save).toHaveBeenCalledWith(savedClient);
      expect(result).toEqual(savedClient);
    });
  });


  describe('findAll', () => {
    it('should return all clients', async () => {
      const clients = [
        { id: 1, name: 'Eduardo', salary: 3500, companyValue: 120000 },
        { id: 2, name: 'Maria', salary: 4000, companyValue: 150000 },
      ];

      repository.find.mockResolvedValue(clients as Client[]);

      const result = await service.findAll();

      expect(result).toEqual(clients);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a client by ID', async () => {
      const client = { id: 1, name: 'Eduardo', salary: 3500, companyValue: 120000 };

      repository.findOneBy.mockResolvedValue(client as Client);

      const result = await service.findOne(1);

      expect(result).toEqual(client);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const updateClientDto = { name: 'Eduardo Atualizado', salary: 4000, companyValue: 130000 };
      const updatedClient = { id: 1, ...updateClientDto };

      repository.update.mockResolvedValue(undefined);
      repository.findOneBy.mockResolvedValue(updatedClient as Client);

      const result = await service.update(1, updateClientDto);

      expect(result).toEqual(updatedClient);
      expect(repository.update).toHaveBeenCalledWith(1, updateClientDto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('remove', () => {
    it('should delete a client by ID', async () => {
      const client: Client = { id: 1, name: 'Eduardo', salary: 3500, companyValue: 120000 };

      repository.findOneBy.mockResolvedValue(client);
      repository.delete.mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
