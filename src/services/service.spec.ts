import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: jest.Mocked<ServicesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
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

    controller = module.get<ServicesController>(ServicesController);
    service = module.get(ServicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a service and return HTTP status code 201', async () => {
      const dto = new CreateServiceDto();
      service.create.mockResolvedValue(201);

      const response = await controller.create(dto);
      expect(response).toEqual(201);
    });
  });

  describe('findAll', () => {
    it('should retrieve all services and return them', async () => {
      const result = [
        {
          service_id: 1,
          provider_id: 123,
          service_type_id: 456,
          description: 'Some description',
          pricing: 100.0,
          availability: 'Available',
          date_created: new Date(),
          service_image_url: 'https://someurl.com',
        },
        {
          service_id: 2,
          provider_id: 124,
          service_type_id: 457,
          description: 'Another description',
          pricing: 200.0,
          availability: 'Not available',
          date_created: new Date(),
          service_image_url: 'https://someurl.com',
        },
      ];
      service.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should retrieve a service by ID and return it', async () => {
      const dto = new UpdateServiceDto();
      const result = { service_id: 1, ...dto };
      service.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a service by ID and return the updated service', async () => {
      const dto = new UpdateServiceDto();
      service.update.mockResolvedValue(200);

      expect(await controller.update('1', dto)).toEqual(200);
    });
  });

  describe('remove', () => {
    it('should delete a service by ID and return the deleted service', async () => {
      service.remove.mockResolvedValue(200);
      expect(await controller.remove('1')).toEqual(200);
    });
  });
});
