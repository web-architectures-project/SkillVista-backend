import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTypesController } from './service_types.controller';
import { ServiceTypesService } from './service_types.service';

describe('ServicesController', () => {
  let controller: ServiceTypesController;
  let service: jest.Mocked<ServiceTypesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceTypesController],
      providers: [
        {
          provide: ServiceTypesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ServiceTypesController>(ServiceTypesController);
    service = module.get(ServiceTypesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a service and return it', async () => {
      const dto = {
        service_name: 'Test Service',
        description: 'Test Description',
        service_category_id: 1,
      };
      const result = { service_category_id: 1, ...dto };
      service.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should retrieve all services and return them', async () => {
      const result = [
        {
          service_category_id: 1,
          service_name: 'Test Service',
          description: 'Some description',
        },
      ];
      service.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should retrieve a service by ID and return it', async () => {
      const result = {
        service_category_id: 1,
        service_name: 'Test Service',
        description: 'Some description',
      };
      service.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a service by ID and return the updated service', async () => {
      const dto = {
        service_category_id: 1,
        service_name: 'Updated Test Service',
        description: 'Updated Test Description',
      };
      const result = { service_category_id: 1, ...dto };
      service.update.mockResolvedValue(result);

      expect(await controller.update('1', dto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete a service by ID', async () => {
      const result = {
        service_category_id: 1,
        service_name: 'Test Service',
        description: 'Some description',
      };
      service.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
    });
  });
});
